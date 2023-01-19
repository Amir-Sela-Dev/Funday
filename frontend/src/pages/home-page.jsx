import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import logo from '../assets/img/logo.png'
import { CHANGE_COUNT } from '../store/user.reducer'

export function HomePage() {

    const cover = 'cover.png'


    return (
        <section className='home-page'>
            <img className="cover-img" src={require(`/src/assets/img/${cover}`)} />
            <Link className='see-demo' to="/board/uPD5q"> See Demo ⇨</Link>
        </section >
    )
}