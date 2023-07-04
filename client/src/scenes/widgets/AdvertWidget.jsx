import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { baseUrl } from "utils/constants";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={`${baseUrl}assets/g1.jpg`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Make My Trip</Typography>
        <Typography color={medium}>makemytrip.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Make every trips memorable with Make my trip.We have exciting offers for
        you..
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
