import React from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import InfiniteScroll from "react-infinite-scroll-component";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      photosData: [],
      id: "",
      isLoading: false,
      activeItemIndex: 0,
      count: 4
    };
    this.renderAlbumPhotos = this.renderAlbumPhotos.bind(this);
  }

  changeActiveItem = activeItemIndex => this.setState({ activeItemIndex });

  async componentDidMount() {
    await this.renderUser();
  }

  async renderUser() {
    var url = "https://jsonplaceholder.typicode.com/albums";
    var response = await axios
      .get(url)
      .then(function(response) {
        // handle success
        console.log(response.data);
        return response;
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });

    var photos = [];
    var countData = [];
    for (var j = this.state.data.length; j < this.state.count; j++) {
      countData.push(response.data[j]);
    }
    for (var i = 0; i < countData.length; i++) {
      var res = await this.renderAlbumPhotos(countData[i].id);
      var obj = { id: countData[i].id, data: res.data };
      photos[photos.length] = obj;
    }
    if (photos.length !== 0) {
      this.setState({
        photosData: this.state.photosData.concat(photos),
        isLoading: true
      });
    }

    this.setState({ data: this.state.data.concat(countData) });
  }

  async renderAlbumPhotos(id) {
    var response;
    var url = `https://jsonplaceholder.typicode.com/photos?albumId=${id}`;
    response = await axios
      .get(url)
      .then(function(response) {
        console.log(response.data);
        return response;
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {});

    return response;
  }

  loadMore = async () => {
    this.setState({ count: this.state.count + 2 });
    await this.renderUser();
  };

  renderPhots = id => {
    return this.state.photosData.map(e => {
      console.log("what is......id", id, e.id);
      if (id === e.id) {
        return e.data.map(v => {
          return (
            <div
              style={{ padding: 2, border: 10, backgroundColor: "#f3f3f3 " }}
            >
              <img src={v.url} alt={v.url} style={{ height: 200, width: 500 }} />
            </div>
          );
        });
      }
    });
  };

  renderItem() {
    return this.state.data.map(e => {
      return (
        <Card
          style={{
            width: "100%",
            backgroundColor: "#f2f2f2",
            border: "5px solid white",
            margin: 20
          }}
        >
          <div style={{ padding: 20, margin: 20 }}>
            <h1>{e.title}</h1>
            <div style={{ paddingLeft: 20 }}>
              <h4> userid {e.id}</h4>
            </div>
          </div>
          <div style={{ border: "2px solid white" }}>
            <div style={{ backgroundColor: "#ffffff" }}>
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={false}
                responsive={responsive}
                ssr={false} // means to render carousel on server-side.
                infinite={false}
                autoPlay={this.props.deviceType !== "mobile" ? false : true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .9"
                transitionDuration={1000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
              >
                {this.state.photosData ? this.renderPhots(e.id) : <div></div>}
              </Carousel>
            </div>
          </div>
        </Card>
      );
    });
  }
  render() {
    return (
      <div>
        {this.state.photosData ? (
          <InfiniteScroll
            dataLength={this.state.data.length}
            next={this.loadMore}
            hasMore={true}
            loader={<h2>Loading...</h2>}
            scrollThreshold={0.7}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {this.renderItem()}
          </InfiniteScroll>
        ) : (
          <div
            style={{ flex: 1, alignContent: "center", flexDirection: "row" }}
          >
            <p>Loading..</p>
          </div>
        )}
        {/* <Button onClick={() => this.loadMore()}>LoadMore</Button> */}
      </div>
    );
  }
}

export default App;
