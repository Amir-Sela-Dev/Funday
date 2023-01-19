import React from 'react'
import { Link } from "react-router-dom"

export function HomePage() {

    const cover = 'cover.png'

    return (
        <section className='home-page'>
            <img className="cover-img" src={require(`/src/assets/img/${cover}`)} />
            <Link className='see-demo' to="/board/uPD5q"> See Demo ⇨</Link>
        </section >
    )
}