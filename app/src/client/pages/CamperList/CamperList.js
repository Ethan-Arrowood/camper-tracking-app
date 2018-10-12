import React from 'react'
import './CamperList.css'
import { FixedSizeList as List } from 'react-window'
import NewCamperForm from './NewCamperForm'
import ListItem from './ListItem'

class CamperList extends React.Component {
  state = {
    camperData: [],
    nameSearchValue: '',
  }

  _fetchCampersRequest = null

  handleChange = e => {
    let searchValue = e.target.value
    this.setState(
      { nameSearchValue: searchValue },
      this.fetchCampers(searchValue)
    )
  }

  fetchCampers = searchValue => {
    if (this._fetchCampersRequest === null) {
      let query = '/api/campers?sac=True'
      if (searchValue) query += `&search=${searchValue}`
      this._fetchCampersRequest = this.fetchCamperData(query).then(res => {
        this._fetchCampersRequest = null
        this.setState({ camperData: res.campers })
      })
    }
  }

  fetchCamperData = async req => {
    try {
      const response = await fetch(req)
      return await response.json()
    } catch (err) {
      console.error(err)
      return []
    }
  }

  componentDidMount() {
    this.fetchCampers()
  }

  render() {
    return (
      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={this.state.nameSearchValue}
            onChange={this.handleChange}
          />
        </div>
        <List
          className="list"
          height={250}
          itemCount={this.state.camperData.length}
          itemSize={35}
          width={600}
        >
          {props => <ListItem {...props} data={this.state.camperData} />}
        </List>
        <div className="new-camper-form">
          <NewCamperForm
            updateList={() => this.fetchCampers(this.state.nameSearchValue)}
          />
        </div>
      </div>
    )
  }
}

export default CamperList
