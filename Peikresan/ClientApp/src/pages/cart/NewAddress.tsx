import React from "react";
import NeshanMap from "react-neshan-map-leaflet";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, message } from "antd";
import { AimOutlined } from "@ant-design/icons";

import SimpleLayout from "../../components/SimpleLayout";
import { CartPath } from "../../shares/URLs";
import { actionCreators } from "../../store/ShopCart";
import { ApplicationState } from "../../store";

import "./DeliverAddress.css";

interface INewAddressProps {
  latitude?: number;
  longitude?: number;
  ChooseLocation: Function;
}

const NewAddress: React.FC<INewAddressProps> = ({
  latitude,
  longitude,
  ChooseLocation,
}) => {
  const history = useHistory();

  // const [defaultLocation, setDefaultLocation] = React.useState({
  //   lat: 36.90735251496186,
  //   lang: 50.664310455322266,
  // });
  // const [mapMarker, setMapMarker] = React.useState<any>();
  // const [mapElement, setMapElement] = React.useState<any>();

  const initMap = (L: any, myMap: any) => {
    console.log("init map");

    // setMapElement(myMap);
    let marker: any;
    if (latitude && longitude) {
      marker = L.marker([latitude, longitude])
        .addTo(myMap)
        .bindPopup("محل تحویل");
      // setMapMarker(marker);
    }

    myMap.on("click", function (e: any) {
      if (!marker) {
        marker = L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(myMap)
          .bindPopup("محل تحویل");
        // setMapMarker(marker);
      } else {
        marker.setLatLng(e.latlng);
        // setMapMarker(marker);
      }

      ChooseLocation(e.latlng.lat, e.latlng.lng);
    });
  };

  const neshanMap = React.useMemo(
    () => (
      <NeshanMap
        options={{
          key: "web.XxEaHY5vRVBzSohpITdF9929HR8cASxnRdU4XXbF",
          maptype: "dreamy",
          poi: true,
          traffic: false,
          center: [36.90735251496186, 50.664310455322266],
          zoom: 13,
        }}
        onInit={initMap}
      />
    ),
    []
  );

  return (
    <SimpleLayout
      title="انتخاب آدرس مقصد"
      subTitle=""
      backPage={CartPath.AddressesList}
    >
      {neshanMap}

      <div className="under-map-line">
        <Button
          icon={<AimOutlined />}
          className="under-map-btn left"
          type="default"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  ChooseLocation(
                    position.coords.latitude,
                    position.coords.longitude
                  );
                  history.push(CartPath.CompleteAddress);
                },
                (error) => {
                  message.warn("خطا در خواندن موقعیت مکانی");
                  console.log(error);
                }
              );
            } else {
              message.warn("خطا در خواندن مکان");
            }
          }}
        >
          مکان فعلی
        </Button>

        {latitude && longitude && (
          <Link className="under-map-btn right" to={CartPath.CompleteAddress}>
            <Button type="primary">مرحله بعد</Button>
          </Link>
        )}
      </div>
    </SimpleLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  latitude: state.shopCart?.latitude,
  longitude: state.shopCart?.longitude,
});

const mapDispatchToProps = {
  ChooseLocation: actionCreators.chooseLocationOnMap,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewAddress);
