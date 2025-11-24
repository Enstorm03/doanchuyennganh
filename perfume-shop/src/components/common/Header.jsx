import { Link } from 'react-router-dom';

const Header = ({ brandName = "PerfumeStore" }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-10 py-3 bg-surface-light dark:bg-surface-dark sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
          <div className="text-primary text-2xl">
            <span className="material-symbols-outlined">filter_vintage</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{brandName}</h2>
        </div>
        <div className="hidden lg:flex items-center gap-9">
          <Link className="text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang Chu</Link>
          <Link className="text-sm font-medium leading-normal text-primary dark:text-primary" to="/category">San Pham</Link>
          <a className="text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="#">Thuong Hieu</a>
          <a className="text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="#">Blog</a>
        </div>
      </div>
      <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-subtle-light dark:text-subtle-dark flex border-none bg-background-light dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg border-l-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-background-light dark:bg-background-dark focus:border-none h-full placeholder:text-subtle-light placeholder:dark:text-subtle-dark px-4 py-0 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search" value="" />
          </div>
        </label>
        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-background-light dark:bg-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined">favorite</span>
        </button>
        <Link to="/cart" className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-background-light dark:bg-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined">shopping_bag</span>
        </Link>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBACtAcXKBlULVbyR6ZZHiCzxUaOZhK1qBtm8OGSPBE_vMLVNb2rqE2hZpVZNOJs6DBg_y0-le1eQGVGG86I8r2MgAIsFJ6OU6Gf8j17rNSt15LBNC80_NV04MXKsrrh9hoDag91qTlAZB_gJ4tignFbD2ppFKf0pEgFEUPxI5l2gA2u_G6aW1qwJnNTsdpIBlvC8TMscAwmnfR218XQZ3K7iT-aWYmRz5Aolr-d1NNNr-kwPdW1QbYcd0qIQneNG2LOpnpyFspF4k')" }}></div>
      </div>
    </header>
  );
};

export default Header;
