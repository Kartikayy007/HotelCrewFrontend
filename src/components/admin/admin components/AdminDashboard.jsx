import React from "react";

function AdminDashboard() {
  const date = new Date();
  const hours = date.getHours();
  let greeting = "";
  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <section className="bg-[grey] h-full w-full">
      <h1 className="text-3xl font-semibold p-8">{greeting}</h1>

      <div className="flex justify-between mx-12">

        <div className="flex flex-col gap-9 w-4/6">
          <div className="bg-white rounded-lg shadow h-60 w-full"></div>
          <div className="bg-white rounded-lg shadow h-60 w-full"></div>
        </div>

        <div className="flex flex-col gap-9 h-screen w-[30%]">
          <div className="bg-white rounded-lg shadow h-96 w-full"></div>
          <div className="bg-white rounded-lg shadow h-60 w-full"></div>
        </div>

      </div>
    </section>
  );
}

export default AdminDashboard;
