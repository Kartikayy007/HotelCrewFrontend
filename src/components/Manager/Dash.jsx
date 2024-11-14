import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Dash = () => {

  return (
    <section>
      <h2 className="text-[#252941] text-2xl font-semibold">Dashboard</h2>
      <div className="p-3 flex flex-row gap-6">
          <div className="bg-white w-[70%] h-[50%] pt-4 pb-4 pr-6 pl-6 rounded-lg">hi</div>
          <div className="bg-white w-[30%] h-[50%] p-4">ho</div>
      </div>
      
    </section>
  )
}

export default Dash;