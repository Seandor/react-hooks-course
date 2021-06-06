import React, { useEffect, useState, useContext, useReducer, useCallback, useMemo } from 'react'

import { Header } from './Header'
import { Menu } from './Menu'
import SpeakerData from './SpeakerData'
import SpeakerDetail from './SpeakerDetail'
import { ConfigContext } from './App'

const Speakers = () => {
  const [speakingSaturday, setSpeakingSaturday] = useState(true)
  const [speakingSunday, setSpeakingSunday] = useState(true)

  function speakersReducer (state, action) {
    function updateFavorite (favoriteValue) {
      return state.map((item) => {
        if (item.id === action.sessionId) {
          item.favorite = favoriteValue
        }
        return item
      })
    }
    switch (action.type) {
    case 'setSpeakerList': {
      return action.data
    }
    case 'favorite': {
      return updateFavorite(true)
    }
    case 'unfavorite': {
      return updateFavorite(false)
    }
    default:
      return state
    }
  }

  // const [speakerList, setSpeakerList] = useState([])
  const [speakerList, dispatch] = useReducer(speakersReducer, [])
  const [isLoading, setIsLoading] = useState(true)

  const context = useContext(ConfigContext)

  useEffect(() => {
    setIsLoading(true)
    new Promise(function (resolve) {
      setTimeout(function () {
        resolve()
      }, 1000)
    }).then(() => {
      setIsLoading(false)
      const speakerListServerFilter = SpeakerData.filter(({ sat, sun }) => {
        return (speakingSaturday && sat) || (speakingSunday && sun)
      })
      dispatch({
        type: 'setSpeakerList',
        data: speakerListServerFilter
      })
    })

    return () => {
      console.log('cleanup')
    }
  }, [])

  const handleChangeSaturday = () => {
    setSpeakingSaturday(!speakingSaturday)
  }

  const handleChangeSunday = () => {
    setSpeakingSunday(!speakingSunday)
  }

  const newSpeakerList = useMemo(() => {
    return speakerList
      .filter(
        ({ sat, sun }) =>
          (speakingSaturday && sat) || (speakingSunday && sun),
      )
      .sort(function (a, b) {
        if (a.firstName < b.firstName) {
          return -1
        }
        if (a.firstName > b.firstName) {
          return 1
        }
        return 0
      })
  }, [speakingSaturday, speakingSunday, speakerList])

  // why is this updated automatically?
  const speakerListFiltered = isLoading
    ? []
    : newSpeakerList

  const heartFavoriteHandler = useCallback((e, favoriteValue) => {
    e.preventDefault()
    const sessionId = parseInt(e.target.attributes['data-sessionid'].value)

    dispatch({
      type: favoriteValue ? 'favorite' : 'unfavorite',
      sessionId
    })
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header />
      <Menu />
      <div className="container">
        <div className="btn-toolbar margintopbottom5 chekbox-bigger">
          {context.showSpeakerSpeakingDays === false ? null : (
            <div className="hide">
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSaturday}
                    checked={speakingSaturday}
                  />
                Saturday Speakers
                </label>
              </div>
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSunday}
                    checked={speakingSunday}
                  />
                Sunday Speakers
                </label>
              </div>
            </div>)}
        </div>
        <div className="row">
          <div className="card-deck">
            {speakerListFiltered.map(
              ({ id, firstName, lastName, bio, favorite }) => {
                return (
                  <SpeakerDetail
                    key={id}
                    id={id}
                    favorite={favorite}
                    firstName={firstName}
                    lastName={lastName}
                    bio={bio}
                    onHeartFavoriteHandler={heartFavoriteHandler}
                  />
                )
              },
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Speakers
