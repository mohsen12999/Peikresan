import React from "react";
import { connect } from "react-redux";
import NeshanMap from "react-neshan-map-leaflet";
import { Button } from "antd";
import { Link } from "react-router-dom";

import { actionCreators } from "../../store/ShopCart";
import { ApplicationState } from "../../store";
import MyLayout from "../../components/MyLayout";
import { CartPath } from "../../shares/URLs";

interface IDeliverMapProps {
  latitude?: number;
  longitude?: number;
  ChooseLocation: Function;
}

const DeliverMap: React.FC<IDeliverMapProps> = ({
  latitude,
  longitude,
  ChooseLocation,
}) => {
  const [defaultLocation, setDefaultLocation] = React.useState({
    lat: 36.90735251496186,
    lang: 50.664310455322266,
  });
  // if (latitude && longitude) {
  //   setDefaultLocation({ lat: latitude, lang: longitude });
  // }
  // else {
  //   const geolocation = navigator.geolocation;
  //   if (geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setDefaultLocation({
  //         lat: position.coords.latitude,
  //         lang: position.coords.longitude,
  //       });
  //     });
  //   }
  // }

  return (
    <MyLayout>
      <NeshanMap
        options={{
          key: "web.XxEaHY5vRVBzSohpITdF9929HR8cASxnRdU4XXbF",
          maptype: "dreamy",
          poi: true,
          traffic: false,
          center: [defaultLocation.lat, defaultLocation.lang],
          zoom: 13,
        }}
        onInit={(L: any, myMap: any) => {
          let marker: any;
          if (latitude && longitude) {
            marker = L.marker([latitude, longitude])
              .addTo(myMap)
              .bindPopup("I am a popup.");
          }

          myMap.on("click", function (e: any) {
            if (!marker) {
              marker = L.marker([e.latlng.lat, e.latlng.lng])
                .addTo(myMap)
                .bindPopup("I am a popup.");
            } else {
              marker.setLatLng(e.latlng);
            }

            ChooseLocation(e.latlng.lat, e.latlng.lng);
          });
        }}
      />

      {latitude && longitude && (
        <Link to={CartPath.DeliverAddress}>
          <Button
            style={{ borderRadius: "16px", marginTop: "2rem" }}
            type="primary"
          >
            ادامه خرید
          </Button>
        </Link>
      )}
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  latitude: state.shopCart?.latitude,
  longitude: state.shopCart?.longitude,
});

const mapDispatchToProps = {
  ChooseLocation: actionCreators.chooseLocationOnMap,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliverMap);

/*
https://developers.neshan.org/react-component/
lat: 36.90735251496186, lng: 50.664310455322266
*/
