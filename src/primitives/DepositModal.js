import React from 'react'
import { Flex, Box, Text, Button } from 'rebass'

import fakeJackpot from '../libs/fakeJackpot'

import Dialog from './Dialog'
import ItemPool from './ItemPool/ItemPool'
import PrimaryButton from './PrimaryButton'
import Spinner from './Spinner'

class DepositModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      requesting: false,
      items: [],
      selectedItems: [],
      total: 0,
    }
  }

  componentDidMount() {
    this.onRefresh()
  }

  onRefresh = () => {
    const { onRefresh } = this.props
    this.toggleLoading()

    if (onRefresh) {
      return onRefresh().then(items => {
        this.setState({ items, total: 0, selectedItems: [] })
        this.toggleLoading()
      })
    }

    setTimeout(() => {
      this.toggleLoading()
    }, 1000)
  }

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading })
  }

  onRequest = async () => {
    const { selectedItems } = this.state
    const { onRequest } = this.props
    this.toggleRequesting()

    if (onRequest) {
      return onRequest(selectedItems).then(() => {
        this.toggleRequesting()
        this.setState({ total: 0, selectedItems: [] })
      })
    }

    setTimeout(() => {
      this.toggleRequesting()
    }, 1000)
  }

  toggleRequesting = () => {
    this.setState({ requesting: !this.state.requesting })
  }

  onSelect = item => {
    const { total, selectedItems } = this.state

    console.log(item.selected, item.id)

    if (item.selected) {
      this.setState({
        total: total + item.price,
        selectedItems: [...selectedItems, item.id],
      })
    } else {
      const index = selectedItems.findIndex(id => id === item.id)
      selectedItems.splice(index, 1)

      this.setState({
        total: total - item.price < 0 ? 0 : total - item.price,
        selectedItems,
      })
    }
  }

  render() {
    const { loading, requesting, items, total, selectedItems } = this.state
    return (
      <Dialog
        {...this.props}
        title={`Deposit: $${Number(total).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        buttonText="Deposit"
      >
        {({ state, close }) => (
          <Flex
            // justifyContent="center"
            // alignItems="center"
            css={{
              height: '100%',
              // border: '1px solid',
            }}
            flexDirection="column"
          >
            {loading ? (
              <Flex
                alignItems="center"
                justifyContent="center"
                css={{ height: '100%' }}
              >
                <Spinner fontSize="2em" />
              </Flex>
            ) : (
              <ItemPool
                onSelect={this.onSelect}
                selectable={true}
                items={
                  items || [
                    ...fakeJackpot.items,
                    ...fakeJackpot.items,
                    ...fakeJackpot.items,
                  ]
                }
              />
            )}
            <Box my="auto" />
            <Flex p={2} css={{}}>
              <PrimaryButton
                loading={requesting}
                flex={1}
                onClick={async e => {
                  await this.onRequest()
                  return close()
                }}
              >
                {`Deposit ${selectedItems.length}/${items.length} Items`}
              </PrimaryButton>
              <Box mx={1} />
              <PrimaryButton
                onClick={this.onRefresh}
                bg="rgba(255, 255, 255, 0.1)"
                flex={1}
                loading={loading}
              >
                Refresh Inventory
              </PrimaryButton>
            </Flex>
          </Flex>
        )}
      </Dialog>
    )
  }
}
export default DepositModal
