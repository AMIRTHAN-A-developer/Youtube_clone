import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY } from '../../data';
import { Link } from 'react-router-dom';

const Recommended = ({categoryId}) => {

    const [apiData,setapidata] = useState([]);

    const fetchData = async() => {
        const relatedvideo_url = ` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=33&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY} `

        await fetch(relatedvideo_url).then(res=>res.json()).then(data=>setapidata(data.items))
    }
 
    useEffect( () => {
        fetchData();
    },[]);
    

    const formatCount = (num) => {
        if (!num) return '0';
        if (num >= 1000000) {
          return (num / 1000000).toFixed(0) + 'M';
        }
        if (num >= 1000) {
          return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
      };
    

  return (
    <div className="recommended">
  
    {apiData.map((item,index) => {
        return(
            <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <div className="vid-info">
              <h4>{item.snippet.title}</h4>
              <p>{item.snippet.channelTitle}</p>
              <p>{formatCount(item.statistics.viewCount)}Views</p>
            </div>
          </Link>
        )
    })}

       
        
    </div>
  )
}

export default Recommended