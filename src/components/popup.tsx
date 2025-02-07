import Message from 'antd/lib/message'
import { IconTable } from '@components/icon-table'
import { Window } from '@components/window'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import hash from 'object-hash'
import { IIcon } from 'parse-favicon'
import { getIconsFromPage } from '@utils/get-icons-from-page'
import { go } from '@blackglory/prelude'
import { useMount } from 'extra-react-hooks'

export function Popup() {
  const [loading, setLoading] = useState(true)
  const [iconByHash, updateIconByHash] = useImmer<{ [index: string]: IIcon }>({})
  const icons: IIcon[] = Object.values(iconByHash)

  useMount(() => {
    go(async () => {
      const observable = await getIconsFromPage()

      observable.subscribe({
        next(icon) {
          updateIconByHash(icons => {
            icons[hash(icon)] = icon
          })
        }
      , error(err) {
          setLoading(false)
          console.error(err)
          Message.error(err.message, NaN)
        }
      , complete() {
          setLoading(false)
        }
      })
    })
  })

  return (
    <Window>
      <IconTable
        loading={loading}
        icons={icons}
      />
    </Window>
  )
}
