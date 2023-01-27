import React from 'react'
import { Link } from "react-router-dom"
import { Header } from '../cmps/header'

export function HomePage() {

    const cover = 'cover.png'

    return (
        <section className='home-page'>
              <Header />
            <div className="home-page-main flex">
                <h1> A platform built for a new way of working</h1>
                <p>What would you like to manage with Funnday?</p>
                <Link className='see-demo' to="/board/63d405e743010daa20233aab"> See Demo ⇨</Link>
            </div>
            <img className="cover-img" src={require(`/src/assets/img/${cover}`)} />
        </section >
    )
}