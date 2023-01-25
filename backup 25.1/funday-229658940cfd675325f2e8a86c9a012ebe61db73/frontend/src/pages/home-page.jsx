import React from 'react'
import { Link } from "react-router-dom"

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