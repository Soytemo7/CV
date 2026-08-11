import { ConfigProvider, notification } from "antd";
import NotificationContext from "../context/NotificationContext";

function NotificationProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <ConfigProvider
      theme={{
        components: {
          Notification: {
            colorBgElevated: "#000000",
            colorText: "#ffffff",
            colorTextHeading: "#ffffff",
            colorIcon: "rgba(255, 255, 255, 0.65)",
            colorIconHover: "#ffffff",
            width: 384,
            borderRadiusLG: 8,
            boxShadow:
              "0 8px 24px rgba(0, 0, 0, 0.35)",
          },
        },
      }}
    >
      <NotificationContext.Provider value={api}>
        {contextHolder}
        {children}
      </NotificationContext.Provider>
    </ConfigProvider>
  );
}

export default NotificationProvider;