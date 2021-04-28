import logo from "../assets/logo.png";

export default (props) => {
  return (
    <div class="relative">
      <div class="px-4 sm:px-6">
        <div class="flex justify-between items-center border-b-2 border-gray-700 py-6 md:justify-start md:space-x-10">
          <a href="https://wbtclt.network" class="flex justify-start items-center lg:w-0 lg:flex-1">
            <span class="text-xl lg:text-2xl font-bold text-pink-500">wBTCLT</span>
          </a>
      
          <div class="flex items-center justify-end md:flex-1 lg:w-0">
            <a href="https://bitclout.com/u/wbtclt" target="_blank" class="whitespace-nowrap text-base font-medium text-gray-400 hover:text-pink-500 transform ease-in-out duration-150">@wBTCLT</a>
          </div>
        </div>
      </div>
    </div>
  );
}