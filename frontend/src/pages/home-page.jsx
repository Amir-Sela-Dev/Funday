import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom"
// import logo from '../assets/img/logo.png'
import { CHANGE_COUNT } from '../store/user.reducer'

export function HomePage() {
    const dispatch = useDispatch()
    const count = useSelector(storeState => storeState.userModule.count)

    function changeCount(diff) {
        console.log('Changing count by:', diff);
        dispatch({ type: CHANGE_COUNT, diff })
    }



    return (
        <section className='home-page'>
            <Link className='see-demo' to="/board/uPD5q"> See Demo ⇨</Link>
        </section >
    )
}