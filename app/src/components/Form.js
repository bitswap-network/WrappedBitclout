import React from "react";

class Form extends React.Component {
  render() {
    return (
      <div className="py-12 lg:py-24">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-8 font-extrabold">Swap your BitClout</h2>
        </div>

      <div className="bg-gray-800 p-4 sm:p-6 lg:p-8 max-w-lg mx-auto rounded-2xl shadow-lg text-white">
        <div className="mb-4">
          <nav className="relative z-0 rounded-lg shadow-lg flex" aria-label="Tabs">
            <a href="#" className="text-white rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-indigo-600 py-4 px-4 text-base font-bold text-center hover:bg-indigo-500 focus:z-10 transition duration-150" aria-current="page">
              <span>Buy wBTCLT</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-gray-700 py-4 px-4 text-base font-bold text-center hover:bg-gray-600 focus:z-10 transition duration-150">
              <span>Sell wBTCLT</span>
            </a>
          </nav>
        </div>
        
        <form>
          <div className="mb-1">
            <label for="transferAmount" className="block text-sm font-medium text-gray-400">
              Deposit
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-700 text-white md:text-lg">
                BitClout
              </span>
              <input type="number" name="transferAmount" id="transferAmount" className="flex-1 min-w-0 block bg-gray-700 w-full px-3 py-3 rounded-none rounded-r-lg focus:ring-indigo-500 focus:border-indigo-500 md:text-lg border-gray-600" placeholder="0.000000" />
            </div>
          </div>

          <div className="mb-4 py-4 border-b border-gray-600">
            <div className="flex justify-center">
              <span className="text-gray-300 text-lg">You'll receive <span className="font-bold text-white">14</span> wBTCLT</span>
            </div>

          </div>

          <button type="button" className="block w-full px-6 py-3 border border-transparent text-lg font-bold rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
            Buy
          </button>

        </form>
        
      </div>
    </div>
    );
  }
}

export default Form;