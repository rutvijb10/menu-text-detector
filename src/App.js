import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: '1px',
      canvasHeight: '1px'
    }

  }

  plotImage = (coordinates, imageLink) => {
    // Getting canvas context from HTML
    const ctx = this.refs.canvas.getContext('2d');
    // Creating a new Image
    let myImage = new Image();
    // Handler called when image is loaded
    myImage.onload = () => {
      // Setting state will render the appplication again 
      this.setState({ canvasWidth: myImage.naturalWidth, canvasHeight: myImage.naturalHeight });
      // Image will be drawn
      ctx.drawImage(myImage, 0, 0, myImage.naturalWidth, myImage.naturalHeight);
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      // Coordinates will be added to the image
      for (let coordinate of coordinates) {
        ctx.rect(coordinate['start_x'], coordinate['start_y'], coordinate['end_x'] - coordinate['start_x'], coordinate['end_y'] - coordinate['start_y']);
      }
      ctx.stroke();
    }
    myImage.src = imageLink;
  }

  componentDidMount() {
    let headers = new Headers();
    let imageLink = "";
    let coordinates = [];

    // make api calls
    let basePathURL = 'https://sfuqrfho44.execute-api.us-east-1.amazonaws.com/dev/menu/path/';
    let baseJSONURL = 'https://sfuqrfho44.execute-api.us-east-1.amazonaws.com/dev/menu/JSON/';
    let menuID = 'deepblue';

    const pathCall = fetch(basePathURL + menuID, {
      method: "GET",
      headers: headers
    });

    const coordinateCall = fetch(baseJSONURL + menuID, {
      method: "GET",
      headers: headers
    });

    // Waiting for both the requests to resolve parallelly
    Promise.all([pathCall, coordinateCall])
      .then((res) => Promise.all(res.map(r => r.json())))
      .then(([pathData, coordinateData]) => {
        // Got the data from both the requests
        imageLink = pathData.menu_path;
        coordinates = JSON.parse(coordinateData.menu_JSON).start_end_coordinates;
        //Plot the image
        this.plotImage(coordinates, imageLink);
      });
  }

  render() {
    return (
      <div >
        <canvas ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight} />
      </div>
    );
  }
}

export default App;