import React from 'react';
import { Link } from 'react-router-dom';

const GioHangPage = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Giỏ hàng</span>
        </div>
      </div>

      {/* PageHeading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">Giỏ hàng của bạn</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <div className="hidden sm:grid grid-cols-6 gap-4 text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark pb-2 border-b border-border-light dark:border-border-dark">
              <div className="col-span-3">Sản phẩm</div>
              <div className="col-span-1 text-right">Giá</div>
              <div className="col-span-1 text-center">Số lượng</div>
              <div className="col-span-1 text-right">Tổng</div>
            </div>

            {/* List Item 1 */}
            <div className="grid grid-cols-4 sm:grid-cols-6 items-center gap-4 py-4 border-b border-border-light dark:border-border-dark">
              <div className="col-span-4 sm:col-span-3 flex items-center gap-4">
                <div className="bg-center bg-no-repeat bg-cover rounded-lg h-20 w-20 flex-shrink-0" data-alt="Chanel No. 5 perfume bottle" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsBSoxw6ErTCKumds_UIVYxwmaj-CfU9GYbIYGvTmDYq5ScqyV1RnKbdWXq0Xiz6h9tdlSY-l5VU431WwXaBZweSIhf2Wa13ZB8GQquWZWDFqDcHO_iXGijq7vcEw4cRVXOQz0QxVVZ7Rl9uonBOlwWGojn8ixg8vo3vPxtbYgCaNp7gJvbfPtlqunblceUqk0ShCDTP4CjYP2jWWP38VptksiwTWEfvJ7NkM9sW4QsuGLfNK9MOtTPlGYvHr3m_60DNTRyW4TRx0")` }}></div>
                <div className="flex flex-col">
                  <p className="text-base font-medium">Chanel No. 5 Eau de Parfum</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">100ml</p>
                  <button className="text-left mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">delete</span> Xóa
                  </button>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">$145.00</p>
              </div>
              <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                <div className="flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark bg-background-light dark:bg-background-dark rounded-full p-1">
                  <button className="text-base font-medium flex h-7 w-7 items-center justify-center rounded-full hover:bg-border-light dark:hover:bg-border-dark cursor-pointer transition-colors">-</button>
                  <input className="text-sm font-medium w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" defaultValue="1" />
                  <button className="text-base font-medium flex h-7 w-7 items-center justify-center rounded-full hover:bg-border-light dark:hover:bg-border-dark cursor-pointer transition-colors">+</button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 text-right">
                <p className="text-base font-bold">$145.00</p>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="grid grid-cols-4 sm:grid-cols-6 items-center gap-4 py-4 border-b border-border-light dark:border-border-dark">
              <div className="col-span-4 sm:col-span-3 flex items-center gap-4">
                <div className="bg-center bg-no-repeat bg-cover rounded-lg h-20 w-20 flex-shrink-0" data-alt="Dior Sauvage perfume bottle" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoysrAcul1qWbklfAUMZXe-LlkYgy8jDzPvj3zJpFpz_79rqUdvHmCtSNy40DYvh0zd6V4_b-rQ4OxAY2zeSx06SgSE8yeDyeZzIahhhuzxXRxTf8qZoHNzDAwN9D5IbncGJ96wXJz7iSx5bss0mlkqIH4IUQjWCrnaBHrTfxcmdbW2_FTWtZjM_mjqHF3psYxL7vVnxGitq7h03d4hPLpi9yXAAh5Grligjq9Iqxj5uZ-tg33ISXTDm-rK2KcJAjYEoQrzNxbfwo")` }}></div>
                <div className="flex flex-col">
                  <p className="text-base font-medium">Dior Sauvage Eau de Toilette</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">60ml</p>
                  <button className="text-left mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">delete</span> Xóa
                  </button>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">$85.00</p>
              </div>
              <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                <div className="flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark bg-background-light dark:bg-background-dark rounded-full p-1">
                  <button className="text-base font-medium flex h-7 w-7 items-center justify-center rounded-full hover:bg-border-light dark:hover:bg-border-dark cursor-pointer transition-colors">-</button>
                  <input className="text-sm font-medium w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" defaultValue="2" />
                  <button className="text-base font-medium flex h-7 w-7 items-center justify-center rounded-full hover:bg-border-light dark:hover:bg-border-dark cursor-pointer transition-colors">+</button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 text-right">
                <p className="text-base font-bold">$170.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-content-light dark:bg-content-dark p-6 rounded-xl shadow-sm sticky top-28">
            <h2 className="text-xl font-bold mb-6 border-b border-border-light dark:border-border-dark pb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Tạm tính</span>
                <span className="font-medium">$315.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Phí vận chuyển</span>
                <span className="font-medium">Miễn phí</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
              <div className="flex justify-between items-center text-base font-bold">
                <span>Tổng cộng</span>
                <span>$315.00</span>
              </div>
            </div>
            <Link to="/thanh-toan" className="block text-center w-full mt-6 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300">
              Tiến hành Thanh toán
            </Link>
          </div>
        </div>
      </div>

      {/* You may also like section */}
      <div className="mt-16 md:mt-24">
        <h2 className="text-2xl font-bold mb-6 text-center">Có thể bạn cũng thích</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Product Card 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-center bg-no-repeat bg-cover rounded-lg w-full aspect-square mb-3" data-alt="Tom Ford perfume bottle" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhUvwuuAOOrRBqNoZYZTH_go2Wej7ddd2XG-dkxiGi_mg4DYPKO6Jhc7ctlMFfiEOurdDQDR6-467QsNUU2u2OtwPLYRmdeGVZr3IeYbzbNRWfOI5qtUgoxbNDawzKK6D78BY3RkZ0am3nKqVGV6LLIr73_5bXiWSA0aMTEGZdyVM36X39Jlkg_SCiFcZ8jaAf2yQMZfr_7VHuaFA5tqtHQmzESn3NAqL8UfObeOZgVsQRtzDmXLZn-GaBpapeCrRPx8Q1fZa_vww")` }}></div>
            <h3 className="font-medium group-hover:text-primary transition-colors">Tom Ford Oud Wood</h3>
            <p className="text-sm font-bold">$250.00</p>
          </div>
          {/* Product Card 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-center bg-no-repeat bg-cover rounded-lg w-full aspect-square mb-3" data-alt="Jo Malone perfume bottle" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZzit1NWDgETuhxG6Ftql0Bjhm2_YMsXapK939bCwkEMUASemyk7r6kKSZ1wBtyyfsG2bZcpjv5-JjIhHfpbvf_bBujxDIpqNyMgjk1Dg5QQUpljjLxYTIR-C67HPFdSJysaIOiLlY9Pu5n7vwUvn2APJCvMFSivIiONLknzhSDJuLV3fSrEGIwyPMCYtIDVllZBH3xotQeBFIYvXUIQjp7lt3XiOXDI7p26e2BOMhHt9_y9KtcC04iCYPH69NFUuI4lIa9vyx_m8")` }}></div>
            <h3 className="font-medium group-hover:text-primary transition-colors">Jo Malone London</h3>
            <p className="text-sm font-bold">$140.00</p>
          </div>
          {/* Product Card 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-center bg-no-repeat bg-cover rounded-lg w-full aspect-square mb-3" data-alt="Creed Aventus perfume bottle" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGkb4k9ZWTQs5VFr406HemeZUSsKIiu73fN1fUhShD1laBoQKFXwcZOcIbwgjumGsMeqinqI11sLaFdzTC9wmlKRx53DxmM3QnsRjQoezxlxu4SnjuyX-cNacX062DvioQeEgj20trkLlM99csfSeYYD2A-BWav-DvGEFmeLV-vXLrtt9TM4TfW1IBZEHSb7fLB8Mgp6Ugt7TjQFjqnTmy0W3IWxe3ZBgTPy_JkFiVfRDKNuq8neQjqQ5vhv5Uf7yNWjlg_yA1jEs")` }}></div>
            <h3 className="font-medium group-hover:text-primary transition-colors">Creed Aventus</h3>
            <p className="text-sm font-bold">$335.00</p>
          </div>
          {/* Product Card 4 */}
          <div className="flex flex-col items-center text-center group">
            <div className="bg-center bg-no-repeat bg-cover rounded-lg w-full aspect-square mb-3" data-alt="Le Labo Santal 33 perfume bottle" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYdZQ_rxMAkKYcB0OGj7qacISZf1P0TQd1xLhXrmLdNNhC6oH0NF3wJy9hw9LGqoVEFUc15mpMujl8Hi5OapTwr52OxZeLnSgfqTX9zSk417WZUp8aCr5ZjgkaMP4mzT-mqUY2v8vZ4K8OkyOkXL5z5nt8IB1_k0Us5ztDYBkY-IZe6OhGEPXx5JR6VW9TjZHUj9FM6ZTsojFx5JDLaFa39oqof7Vx5CJDcdIBe1jUpMzjSYNv3IuIvjlHv7ecfkNzRc5gI8YtyMY")` }}></div>
            <h3 className="font-medium group-hover:text-primary transition-colors">Le Labo Santal 33</h3>
            <p className="text-sm font-bold">$192.00</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GioHangPage;