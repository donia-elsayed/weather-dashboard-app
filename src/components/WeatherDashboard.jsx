import React, { Component } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import main from "../images/4.png";
import humadity from "../images/humidity.png";
import pressure from "../images/pressure.png";
import wind from "../images/wind.png";
import sunriseImg from "../images/sunrise.png";
import sunsetImg from "../images/sunset.png";
export default class WeatherDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      weatherData: null,
    };
  }
  validation = Yup.object({
    city: Yup.string()
      .required("City name is required")
      .min(4, "City name must be at least 2 characters"),
  });
  componentDidMount() {
    this.loadPreferences();
  }
  savePreferences = (newPreferences) => {
    this.setState(
      (prevState) => ({
        preferences: {
          ...prevState.preferences,
          ...newPreferences,
        },
      }),
      () => {
        localStorage.setItem(
          "preferences",
          JSON.stringify(this.state.preferences)
        );
      }
    );
  };
  loadPreferences = () => {
    const savedPreferences = JSON.parse(localStorage.getItem("preferences"));
    if (savedPreferences) {
      this.setState({ preferences: savedPreferences });
    }
  };

  fetchWeatherData = async (city) => {
    const api_kEY = "c5114b26e859f7b6bdd4db95a4c9ba41";
    const api__URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_kEY}&units=imperial`;
    const weatherResponse = await fetch(api__URL);
    const data = await weatherResponse.json();

    const sunriseDate = new Date(data.sys.sunrise * 1000);
    const sunsetDate = new Date(data.sys.sunset * 1000);

    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const sunriseTime = sunriseDate.toLocaleTimeString([], options);
    const sunsetTime = sunsetDate.toLocaleTimeString([], options);

    this.setState({
      weatherData: data,
      sunrise: sunriseTime,
      sunset: sunsetTime,
    });
    this.props.saveRecentSearch(city);
  };
  handleSubmit = (values) => {
    this.fetchWeatherData(values.city);
    values.city = "";
  };
  getDynamicStyles = (weatherData) => {
    const temp = weatherData.main.temp;

    if (temp < 10) {
      return "text-blue-500";
    } else if (temp > 30) {
      return "text-red-500";
    } else {
      return "text-black";
    }
  };

  render() {
    const { weatherData, sunrise, sunset } = this.state;
    return (
      <div className="m-5">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Weather Dashboard
        </h1>
        <Formik
          onSubmit={this.handleSubmit}
          initialValues={{ city: "" }}
          validationSchema={this.validation}
        >
          <Form className="text-center">
            <Field
              type="text"
              name="city"
              placeholder="Enter city name"
              className="p-2 border border-gray-400 rounded-xl me-6"
            />
            <ErrorMessage
              name="city"
              component="div"
              className="text-red-600 text-center my-4"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-xl"
            >
              Search
            </button>
          </Form>
        </Formik>

        {weatherData && (
          <div className={`my-5 ${this.getDynamicStyles(weatherData)}`}>
            <h2 className="text-2xl font-bold mb-2 text-center">
              {weatherData.name}
            </h2>
            <div className="flex justify-center align-middle">
              <div className="flex justify-between items-center w-2/4 bg-white border rounded-xl p-5 text-lg mb-2 text-center">
                <div>
                  <p className="font-bold text-2xl">
                    {weatherData.main.temp} °F
                  </p>
                  <p>Feels Like {weatherData.main.feels_like}°</p>
                </div>
                <div className="w-20">
                  <img src={main} alt="" className="block mx-auto w-full" />
                  <p>{weatherData.weather[0].main}</p>
                </div>
                <div>
                  {weatherData.weather.map(({ icon, description, id }) => (
                    <div key={id}>
                      <div className="w-20 block mx-auto">
                        <img
                          src={`http://openweathermap.org/img/w/${icon}.png`}
                          alt=""
                          className="w-full"
                        />
                      </div>
                      <p>{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              <div className="bg-white border rounded-xl px-10 py-5 text-lg mb-2 text-center">
                <img src={humadity} alt="" className="block mx-auto" />
                <p className="mt-1">{weatherData.main.humidity}%</p>
                <h5 className="text-lg mt-2">Humidity</h5>
              </div>
              <div className="bg-white border rounded-xl px-10 py-5 text-lg mb-2 text-center">
                <img src={pressure} alt="" className="block mx-auto" />
                <p className="mt-1">{weatherData.main.pressure}°</p>
                <h5 className="text-lg mt-2">Pressure</h5>
              </div>
              <div className="bg-white border rounded-xl px-10 py-5 text-lg mb-2 text-center">
                <img src={wind} alt="" className="block mx-auto" />
                <p className="mt-1">{weatherData.wind.speed} m/s</p>
                <h5 className="text-lg mt-2">Wind Speed </h5>
              </div>
              <div className="bg-white border rounded-xl px-10 py-5 text-lg mb-2 text-center">
                <img src={sunriseImg} alt="" className="block mx-auto" />
                <p className="mt-3">{sunrise}</p>
                <h5 className="text-lg mt-2"> Sunrise </h5>
              </div>
              <div className="bg-white border rounded-xl px-10 py-5 text-lg mb-2 text-center">
                <img src={sunsetImg} alt="" className="block mx-auto" />
                <p className="mt-3">{sunset}</p>
                <h5 className="text-lg mt-2"> Sunset </h5>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
