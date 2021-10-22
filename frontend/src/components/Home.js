import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router';
import { serverURL } from '../constants/consts';
import dayjs from 'dayjs';

const Home = (props) => {
    const [state, setState] = useState({
                                comicData: {}, 
                                latest: -1
                            });
    useEffect(() => {
        const comicToFetch = props.match.params.comicNumber ? props.match.params.comicNumber : "latest";
        fetch(`${serverURL}/${comicToFetch}`)
            .then( response => response.json())
            .then( data => setState({
                comicData: data, 
                // If user is requesting the latest comic, the latest comic number is in data.num 
                // If user is requesting a specific number, the latest comic number is included with the response data 
                latest: comicToFetch === "latest" ? data.num : data.latestComicNumber
            }));
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
        }
        fetch(serverURL+`/${comicNumberToFetch}`)
            .then( response => response.json())
            .then( data => setState({...state, comicData: data}))
    }

    return (
        <div id="home-container">
            {state.comicData.img && 
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
                    <p style={{"white-space": "pre-wrap"}}>{state.comicData.transcript.length > 0 ? state.comicData.transcript : "No transcript available :("}</p>
                </div>
            </div>}
        </div>
    )
}

export default withRouter(Home);