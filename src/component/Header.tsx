const Header = () => {
  return (
    <header className="px-12 py-5 border-b-2 border-solid border-[#1A1A1A] flex justify-between items-center">
      <div className="flex gap-[42px] items-center">
        <div className="flex gap-2 items-center">
          <img src="/image/axe.png" className="h-8" />
          <div className="text-[#000000CC] text-[32px] font-semibold">
            Pickaxe
          </div>
        </div>
        <div className="flex gap-8 font-semibold lg:gap-12">
          <div>Make a Pickaxe</div>
          <div>Dashboard</div>
          <div>Enterprise</div>
          <div>Tools</div>
        </div>
      </div>
      <div className="flex gap-3">
        <img src="/image/search.png" />
        <img src="/image/user.png" />
        <div className="font-semibold">UserName</div>
        <img src="/image/menu.png" />
      </div>
    </header>
  );
};

export default Header;
