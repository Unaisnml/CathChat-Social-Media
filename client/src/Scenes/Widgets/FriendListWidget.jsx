import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "Components/Friend";
import WidgetWrapper from "Components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../State/state";
import { getFriendList } from "Api/UserRequest";

const FriendListWidget = ({ userId, headers }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await getFriendList(userId, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data) {
      dispatch(setFriends(response.data));
    }
    // debugger
  };

  useEffect(() => {
    getFriends();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper sx={{ position: "sticky", top: "0" }}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(friends)
          ? friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          : null}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
