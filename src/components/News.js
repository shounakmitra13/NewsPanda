import React,{useEffect,useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch ,Link} from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

const  News =(props)=> {
const[articles,setArticles]=useState([]);
const[loading,setLoading]=useState(true);
const[page,setPage]=useState(1);
const[totalResults,setTotalResults]=useState(0);
const  capitalizeFirstLetter=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }
//  constructor(props){
//   super(props);
 // }
  const updateNews=async()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }
  useEffect(()=>{
    document.title=`${capitalizeFirstLetter(props.category)}-NewsPanda`;
    updateNews();
    //eslint-disable-next-line
  },[])
  
 //const prevClickHandle = async () => {
// // setPage(page-1)
 // updateNews();
 // }
 // const nextClickHandle = async () => {
 // setPage(page+1)
 // updateNews();
 // }
const fetchMoreData = async() => {
const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
setPage(page+1);    
let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
};
    return (
    <>
        <h1 className='text-center' style={{margin:'40px 0px',marginTop:'90px'}}>NewsPanda-Headlines from {capitalizeFirstLetter(props.category)} category</h1>
          {loading && <Spinner/>}
    
       <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
        <div className="row">
          { articles.map((element)=>{
            return  <div className="col-md-4" key={element.url}>
            <NewsItem  title={element.title?element.title:""} description={element.description?element.description:""} imageurl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} className="card-img-top"/>
          </div>
            })}          
        </div>
        </div>
        </InfiniteScroll>
        
     </>
    );
  }
News.defaultProps={
  country:'us',
  pagesize:8,
  category:'general',
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category:PropTypes.string,
};
export default News;
