import AdminHeader from "./AdminHeader";
import DeliveryHeader from "./DeliveryHeader";

import HeaderUser from "./HeaderUser";
import NormalHeader from "./NormalHeader";
import SellerHeader from "./SellerHeader";

const RoleNav = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const deliveryPerson = JSON.parse(sessionStorage.getItem("active-delivery"));
  const seller = JSON.parse(sessionStorage.getItem("active-seller"));

  if (user != null) {
    return <HeaderUser />;
  } else if (admin != null) {
    return <AdminHeader />;
  } else if (seller != null) {
    return <SellerHeader />;
  } else if (deliveryPerson != null) {
    return <DeliveryHeader />;
  } else {
    return <NormalHeader />;
  }
};

export default RoleNav;
