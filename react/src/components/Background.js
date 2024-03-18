import './css/Background.css'
import video1 from '../asset/video1.mp4'
import image1 from '../asset/stonkbackground.png'
import image2 from '../asset/money.png'
import image3 from '../asset/money-memes-12.jpg'
const Background = ({playStatus,heroCount}) => {
    if (playStatus){
        return (
            <video className='background fade-in' autoPlay loop muted>
                <source src={video1} type='video/mp4' />
            </video>
        )
    }
    else if(heroCount == 0){
        return <img src={image1} className='background fade-in' alt="" />
    }
    else if(heroCount == 1){
        return <img src={image2} className='background fade-in' alt="" />
    }
    else if(heroCount == 2){
        return <img src={image3} className='background fade-in' alt="" />
    }
}
export default Background