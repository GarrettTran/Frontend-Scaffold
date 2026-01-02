export function Footer(){
  return (
    <footer className="w-full border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-sm text-gray-600">
        <div className="order-1 md:order-none md:text-left">
          <p className="font-medium">© {new Date().getFullYear()} Lab test 2</p>
          <p className="text-xs text-gray-500"></p>
        </div>

        <div className="order-3 md:order-none md:text-center">
          <p className="font-medium">Special thanks</p>
          <p className="text-xs text-gray-500">To Tri Huynh for invaluable support and contributions.</p>
        </div>

        <div className="order-2 md:order-none md:text-right">
        </div>
      </div>
    </footer>
  );
}

export default Footer;