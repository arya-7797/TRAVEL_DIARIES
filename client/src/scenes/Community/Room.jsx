import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Container } from "@mui/material";
import { clientUrl } from "utils/constants";

const RoomPage = () => {
  const { roomId } = useParams();
  const myMeeting = async (element) => {
    const appID = 949723873;
    const serverSecret = "4fe25abbc226836a1a0c595c79c6cd73";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Arya Saji"
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${clientUrl}room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      showScreenSharingButton: false,
    });
  };

  return (
    <div>
      <div ref={myMeeting} />
    </div>
  );
};

export default RoomPage;
