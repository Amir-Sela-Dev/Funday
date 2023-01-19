import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom"
// import logo from '../assets/img/logo.png'
import { CHANGE_COUNT } from '../store/user.reducer'

export function HomePage() {

    const cover = 'cover.png'


    return (
        <section className='home-page'>
            <div className="home-page-main flex">
                <h1> A platform built for a new way of working</h1>
                <p>What would you like to manage with Funnday?</p>
                <Link className='see-demo' to="/board/uPD5q"> See Demo ⇨</Link>
            </div>
            <img className="cover-img" src={require(`/src/assets/img/${cover}`)} />
        </section >
    )
}