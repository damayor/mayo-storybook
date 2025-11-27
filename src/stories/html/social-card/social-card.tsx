import './style.css' 

import { socialNetworkLinks } from "Data/contact";


export const SocialCard = ({
}) => {


  return (
    <div className="card">
      <img src="/assets/profilepro.jpg" alt="" className="card__author-img" />
      
      <h1 className='card__author-name'>David Mayorga</h1>
      <h3 className="card__author-location">Berlin, Germany</h3>
      <h4 className="card__author-description">Software Engineer • Immersive Development</h4>
      
      {
        socialNetworkLinks.map( (element, index) => 
          <SocialButton key={index} textLabel={element.label} url={element.link}></SocialButton>
        )
      }
    </div>
  );
}

const SocialButton = ({textLabel, url = '#'} : {textLabel: string, url: string} ) => (
  <div tabIndex={0} className="social-button" onClick={() => window.open(url, "_blank")}>
    {textLabel}
  </div>
)