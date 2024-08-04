import { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";

// hum kaam fetch se bhi kar sakte hain, but axios over the top kuch achi functionalities provide karta hai.
// Ache se data ko handle karta hai, kaise data aa rha hai aur jaa rha , data ko send karte samay beech me hi aur keys add kar sakte hain.

function App() {
  const [jokes, setJokes] = useState([]);

  // Now we will introduce proxy, every time hum itna bada URL nahi likhenge, hum package.json me proxy naam ka variable bna denge
  // and after that jiss bhi jagah URL ko use karna ho the hum uss jagah proxy ko hi append kar denge.

  // proxy variable hai wo package.json me banta hai and wo kaise banta hai it depends ki apne react app kaise banaya hai.

  // Na ki sirf append hoga but yeh proxy laga di jayegi ki jo reponse ayega wo iss hi url se ayega.
  // Ab server ko lagega jo ki response aa rha hai wo same server se aa rha hai. 
  // proxy laga dene ke baad api ke peeche apne aap http://localhost:3000 append ho jayega.

  // We can say that a proxy is a server or service that devices on a network use as an intermediary to access another server.


  // Another option is ki server ke andar jaakar whitelisting kardo

  // Proxy add karne ke liye bhi different ways hote hain, and it depends ki aapne apni react app kaise banayi hai.
  useEffect(() => {
    // Note -> if mai axios ki jagah simple fetch use karta then mujhe usse json me bhi convert karna padta, so yeh
    // one of the use case hai axios ka.
    axios.get('/api/jokes')
    .then((response) => {
      console.log(response);
      setJokes(response.data);
    })
    .catch((err) => {
      console.log(err);
    })
  })

  // Hum ye same issue backened se bhi solve kar sakte hain by using the CORS package.


  // useEffect(() => {
  //   // If hum direct ese get karne ki koshish karenge, then humare paas cors error aayega.
  //   // CORS error matlab cross origin, humara frontend ka server kisi aur port par chal raha hai, and hum kisi aur port par request kar rahe hain.
  //   axios.get('http://localhost:3000/api/jokes')
  //   .then((response) => {
  //     console.log(response);
  //     setJokes(response.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   })
  // })

  return (
    <>
      <h1>Chai Aur Code</h1>
      <p>Jokes: {jokes.length}</p>

      {jokes.map((joke, index) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;
