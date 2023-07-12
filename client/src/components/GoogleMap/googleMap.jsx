import { Box, Button, ButtonGroup, Input, Skeleton } from "@mui/material";
import { HStack, IconButton, Text, Flex } from "@chakra-ui/react";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 48.8584, lng: 2.2945 };

function GoogleMapApp() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/**@type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  if (!isLoaded) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Skeleton
          variant="rectangular"
          width={400}
          height={300}
          animation="wave"
        />
      </Box>
    );
  }

  async function calculateRoute() {
    if (!originRef.current || !destinationRef.current) {
      return;
    }

    const originInput = originRef.current.querySelector("input");
    const destinationInput = destinationRef.current.querySelector("input");

    if (!originInput || !destinationInput) {
      return;
    }

    if (originInput.value === "" || destinationInput.value === "") {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: { query: originInput.value },
      destination: { query: destinationInput.value },
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");

    if (originRef.current && destinationRef.current) {
      const originInput = originRef.current.querySelector("input");
      const destinationInput = destinationRef.current.querySelector("input");

      if (originInput && destinationInput) {
        originInput.value = "";
        destinationInput.value = "";
      }
    }
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%"></Box>
      {/* {  Google Map Box} */}
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={(map) => setMap(map)}
      >
        <Marker position={center} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgcolor="white"
        shadow="base"
        minw="container.md"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>

          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorscheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>

            <IconButton
              aria-label="center back"
              icon={<CancelIcon />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          <IconButton
            aria-label="center back"
            icon={<SendIcon />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}
export default GoogleMapApp;
