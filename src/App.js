import React, { useRef, useState, useEffect } from 'react'
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import './index.css';
import apiRequest from './apiRequest';
 

function App() {
  const [items, setItems] = useState([
     
  ]);
  const itemlength = items.length;
  const inputRef = useRef()
  const [newlist, setnewlist] = useState('')
  const [isdata, setIsData] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
   
  const API_URL =  'http://localhost:3500/items'

 useEffect(()=>{

  
 
   const fetchItems = async ()=>{
    try{
       const response = await fetch(API_URL)
       if(!response.ok)throw Error("data not found")
       const listitems = await response.json()
       setItems(listitems)
       setFetchError(null)
    } catch(err){
      setFetchError(err.message)
    } finally{
        setIsLoading(false)
    }
   }
 const loadingtime = itemlength >0 ? 2000 : 2000
  setTimeout(() => {
    (async()=>{await fetchItems()})()
   }, loadingtime);
 

 },[])

  const handlechecked = async(e, inputindex, ckdid)=>
  {
  const itemss = items.map((item, index)=> index===inputindex ? {...item, checked:!item.checked, clas: item.checked ? "": "pressed"}: item )
   setItems(itemss)
   const updateitem = itemss.filter((itemval,index)=>index === inputindex)
    const updateOptions = {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({checked:updateitem[0].checked, clas:updateitem[0].clas})
   }
   const updateurl =  `${API_URL}/${ckdid}`

   const result = await apiRequest(updateurl,updateOptions)
   if(result){setFetchError(result)}
  }

  function handledelete(e, inputindex)
  {
   const itemsdelete = items.filter((item,index)=> index!== inputindex )
   setItems(itemsdelete)
  }
  
  function handlelistonchange(e)
  {
    const newli = e.target.value;
    setnewlist(newli)
    setIsData(false)
  }

  const handleaddnewlist = async (e)=>
  {
   if(newlist)
   {
     const newitem = {
     id: itemlength+1,
     checked: "",  
     item: newlist,
     clas:""}
    setItems(previous => [...previous, newitem ])

    const postOptions = {
      method: 'POST',
      Headers: {'Content-type':'application/json'},
      body: JSON.stringify(newitem)
    }
    const result = await apiRequest(API_URL,postOptions)
    if(result){setFetchError(result)}

     setnewlist("")
   inputRef.current.focus()
   }else{
    setIsData(!isdata)
    inputRef.current.focus()
    setTimeout(() => {
      setIsData("");
    }, 2000);
   }
    
  }
  
  const handleaddKeyDown = async(e)=>
  {
    const newitemKeydown = {
      id: itemlength+1,
      checked: "",  
      item: newlist,
      clas:""}
   if(newlist && e.key === "Enter")
   {
       setItems(previous => [...previous,newitemKeydown ])
       const postOptions = {
        method: 'POST',
        Headers: {'Content-type':'application/json'},
        body: JSON.stringify(newitemKeydown)
      } 
      const result = await apiRequest(API_URL,postOptions)
      if(result){setFetchError(result)}

   setnewlist("")
   inputRef.current.focus()
    }
   else{
 
    setIsData(!isdata)
    inputRef.current.focus()
    setTimeout(() => {
      setIsData("");
    }, 2000);
    }
    
  }
  
  return (
    <div>
      <Header />
      <AddItem  
         handlelistonchange = {handlelistonchange}
         handleaddKeyDown = {handleaddKeyDown} 
         handleaddnewlist ={handleaddnewlist}
         inputRef={inputRef}
         newlist={newlist}
      />
      <Content 
          items={items}
          handlechecked = {handlechecked}
          handledelete = {handledelete}
          isdata={isdata}
          fetchError = {fetchError}
          isLoading = {isLoading}
      />
      <Footer />
     </div>
  );
}

export default App;
