import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router';
import { serverURL } from '../constants/consts';
import dayjs from 'dayjs';

const Home = (props) => {
    const [state, setState] = useState({
                                comicData: {}, 
                                latest: -1,
                                errorMessage: ""
                            });
    useEffect(() => {
        const comicToFetch = props.match.params.comicNumber ? props.match.params.comicNumber : "latest";
        fetch(`${serverURL}/${comicToFetch}`)
            .then( response => response.json())
            .then( data => {
                if (data.status !== undefined && data.status === 404) {
                    const errorMessage = "Oops! I couldn't find the comic number you were searching for."; 
                    setState({...state, errorMessage});
                } else {
                    setState({
                        ...state,
                        comicData: data, 
                        // If user is requesting the latest comic, the latest comic number is in data.num 
                        // If user is requesting a specific number, the latest comic number is included with the response data 
                        latest: comicToFetch === "latest" ? data.num : data.latestComicNumber
                    })
                }
                
            });
    }, [])

    const getComicDate = () => {
        return dayjs(`${state.comicData.year}-${state.comicData.month}-${state.comicData.day}`).format("MMMM D, YYYY");
    }

    const changeComic = (event) => {
        let comicNumberToFetch = state.comicData.num; 
        switch (event.currentTarget.value) {
            case ("previous"):
                comicNumberToFetch--;
                break;
            case ("next"):
                comicNumberToFetch++;
                break;
            case ("random"):
                comicNumberToFetch = Math.floor(Math.random() * state.latest) + 1;
                break;
            case ("latest"):
                comicNumberToFetch = "latest";
                break;
        }
        fetch(serverURL+`/${comicNumberToFetch}`)
            .then( response => response.json())
            .then( data => setState({...state, comicData: data, errorMessage: ""}))
    }

    return (
        <div id="home-container">
            {
                state.errorMessage.length > 0 && 
                    <div id="error-container">
                        <div id="error-body">
                            <h1>{state.errorMessage}</h1>
                            <button value="latest" className="change-button" onClick={(e) => {
                                changeComic(e);
                                props.history.push('/')
                            }}>Click here to go to the most recent comic.</button>
                        </div>
                        
                    </div>
            }
            {
                state.comicData.img && 
                    <div>
                        <div className="comic-number-header">
                            <h2 >Comic #{state.comicData.num}</h2>
                            <p>Created on: {getComicDate()}</p>
                            <p>View Count: {state.comicData.numberOfViews}</p>
                        </div>
                        <div id="button-container">
                            <button className="change-button" value="previous" onClick={changeComic}>Previous</button>
                            <button className="change-button" value="random" onClick={changeComic}>Random</button>
                            <button disabled={state.latest === state.comicData.num} className={`change-button ${state.latest === state.comicData.num ? "hide-element" : ""}`} value="next" onClick={changeComic}>Next</button>
                        </div>
                        <div>
                            <img src={state.comicData.img} alt={state.comicData.alt} />
                        </div>
                        <div id="transcript-container">
                            <h2>Transcript:</h2>
                            <p style={{"whiteSpace": "pre-wrap"}}>{state.comicData.transcript.length > 0 ? state.comicData.transcript : "No transcript available :("}</p>
                        </div>
                    </div>
            }
        </div>
    )
}

export default withRouter(Home);