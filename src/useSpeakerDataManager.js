import { useEffect, useReducer, useContext } from 'react'
import axios from 'axios'

import { InitialSpeakerDataContext } from '../pages/speakers'

function useSpeakerDataManager () {
  function speakersReducer (state, action) {
    function updateFavorite (favoriteValue) {
      return state.speakerList.map((item) => {
        if (item.id === action.id) {
          return { ...item, favorite: favoriteValue }
        }
        return item
      })
    }
    switch (action.type) {
    case 'setSpeakerList': {
      return { ...state, speakerList: action.data, isLoading: false }
    }
    case 'favorite': {
      return { ...state, speakerList: updateFavorite(true) }
    }
    case 'unfavorite': {
      return { ...state, speakerList: updateFavorite(false) }
    }
    default:
      return state
    }
  }

  const initialSpeakersData = useContext(InitialSpeakerDataContext)

  const [{ isLoading, speakerList }, dispatch] = useReducer(speakersReducer, {
    isLoading: true,
    speakerList: []
  })

  function toggleSpeakerFavorite (speakerRec) {
    const updateData = async function () {
      axios.put(`/api/speakers/${speakerRec.id}`, {
        ...speakerRec,
        favorite: !speakerRec.favorite,
      })
      speakerRec.favorite === true
        ? dispatch({ type: 'unfavorite', id: speakerRec.id })
        : dispatch({ type: 'favorite', id: speakerRec.id })
    }
    updateData()
  }

  useEffect(() => {
    const fetchData = async function () {
      let result = await axios.get('/api/speakers')
      dispatch({
        type: 'setSpeakerList',
        data: result.data
      })
    }
    fetchData()

    return () => {
      console.log('cleanup')
    }
  }, [])

  return { isLoading, speakerList, toggleSpeakerFavorite }
}

export default useSpeakerDataManager
