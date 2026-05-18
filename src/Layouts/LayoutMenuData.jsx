import React from "react";

const Navdata = () => {
  const menuItems = [
    {
      label: "Management",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "bx bxs-dashboard",
      link: "/",
    },
    {
      id: "users",
      label: "Users",
      icon: "ri-group-line",
      link: "/users",
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: "ri-door-open-line",
      link: "/rooms",
    },
    {
      id: "tenants",
      label: "Tenants",
      icon: "ri-user-shared-line",
      link: "/tenants",
    },
    {
      id: "payments",
      label: "Payments",
      icon: "ri-wallet-3-line",
      link: "/payments",
    },
    {
      id: "staff",
      label: "Staff",
      icon: "ri-shield-user-line",
      link: "/staff",
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: "ri-message-3-line",
      link: "/complaints",
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: "ri-money-dollar-circle-line",
      link: "/expenses",
    },
    {
      id: "visitors",
      label: "Visitors",
      icon: "ri-map-pin-user-line",
      link: "/visitors",
    },
    {
      id: "notices",
      label: "Notices",
      icon: "ri-advertisement-line",
      link: "/notices",
    },
  ];

  return {
    props: {
      children: menuItems
    }
  };
};

export default Navdata;
