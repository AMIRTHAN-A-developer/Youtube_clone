import React, { useEffect, useState } from 'react';
import './Playvideo.css';
import moment  from 'moment';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY } from '../../data';
import { useParams } from 'react-router-dom';

const Playvideo = () => {

  const {videoId} =useParams();

  const[apiData,setApiData] = useState(null);
  const[channelData,setchannelData]= useState(null);
  const[commentData,setcommentData]= useState([]);

  const fetchvideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url).then(res=>res.json()).then(data =>setApiData(data.items[0]));

  }

  const fetchotherData = async () => {
    const channelData_url = ` https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY} `
    await fetch(channelData_url).then(res => res.json()).then(data=>setchannelData(data.items[0]))

    const Comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=30&videoId=${videoId}&key=${API_KEY} `;
    await fetch(Comment_url).then(res=>res.json()).then(data=>setcommentData(data.items))
  }

  useEffect(()=>{
    fetchvideoData();
  },[videoId]);

  useEffect( () =>{
    fetchotherData();
  },[apiData])

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
    <div className="play-video">
     <iframe  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
      <div className="play-video-info">
      <p>2M Views.{moment(apiData?.snippet?.publishedAt).fromNow()} </p> 
        <div>
        <span>
    <img src={like} alt="Like" />
    {formatCount( apiData?.statistics?.thumnails.LikeCount || "980K")}
    </span>
    <span className="action-btn">
    <img src={dislike} alt="Dislike" />
   {formatCount(apiData?apiData.statistics?.thumnails .dislikeCount:"89")}
  </span>
   <span><img src={share} alt="" />Share</span>
    <span><img src={save} alt="" />Save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?channelData.snippet.thumbnails.medium.url:"Jack"} alt="" />
        <div>
          <p>{apiData?apiData.snippet.channelTitle:""}</p>
          <span>{channelData?formatCount(channelData.statistics.subscriberCount):"1M"} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="video-description">
       <p>{apiData?apiData.snippet.description.slice(0,410):"Description here"}</p>
        <hr />
        <h4> {apiData?.statistics?.commentscount ||"103k"} Comments</h4>
        {commentData.map((item,index) =>{

          return(
            <div key={index} className="comment">
          <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
          <div>
            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>1 day ago</span></h3>
            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>{formatCount(item.snippet.topLevelComment.snippet.likeCount)}</span>
              <img src={dislike} alt="" />
            </div>
          </div>
        </div>
          );
        })}
      </div>
    </div>
  )
}

export default Playvideo ;