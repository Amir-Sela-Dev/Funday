import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React from 'react'
import { Header } from '../cmps/header'

export function HomePage() {
    const videoBG = 'stars.mp4'
    const cover = 'cover.png'

    return (
        <section className='home-page'>
            <Header />

            <video className="cover-video" src={require(`/src/assets/img/${videoBG}`)} autoPlay loop muted />
            <div className="content">
                <h1> A platform built for a new way of working</h1>
                <p>Manage your information in an easy, clear, fast and smart way</p>
                <Link className='see-demo' to={`/board/63d5b54e7d97b7406caecd80`}>get started ⇨</Link>
            </div>
            <div className="triangle-wrapper">
                <div className="triangle"></div>
            </div>
            <div className="about-us flex">
                <h2 className="about-title">Our Crew</h2>
                <div className="main-avatars flex">

                    <div className="about-avatar">
                        <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462764/img3_zynodi.jpg' />
                        <p>Amir Sela</p>
                    </div>

                    <div className="about-avatar">
                        <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462891/image_1_w0fgmh.png' />
                        <p>Sheilan Shamilov</p>
                    </div>

                    <div className="about-avatar">
                        <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462524/profile_vyll5h.jpg' />
                        <p>Amir Yakubov</p>
                    </div>

                </div>
            </div>
            <hr className="home-page-hr" />
            <div className="our-clients">
                <h2 className="about-title">Our Clients</h2>
                <p>Trusted by 178,000+ customers worldwide
                </p>
                <div className="clients-img flex">
                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/genpact.png" />
                    </div>
                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/HoltCat.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/canva.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/coca_cola.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/lionsgate.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/hulu.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/bd.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/Electronic_Arts.png" />
                    </div>

                    <div className="img-wrap">
                        <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/universal.png" />
                    </div>
                </div>
            </div>

        </section >
    )
}
