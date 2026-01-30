import React from 'react'
import HomeBanner from '../../components/banners/home_banner';
import Benefits from '../../components/benefits';
import ProductListTrend from '../../components/products/product_trend';
import Categories from '../../components/categories';
import HomeBannerCollection from '../../components/banners/home_banner_collection';
import ProductTabs from '../../components/products/product_tabs';
import ProductListShowCase from '../../components/products/product_list_show_case';
import BottomBanner from '../../components/banners/bottom_banner';
import useRecentProduct from '../../hooks/use_recent_product';
import ProductListSlider from '../../components/products/product_list_slider';

const Home = () => {
    const { products } = useRecentProduct()

    return (
        <div>
            <HomeBanner />
            <Benefits />
            <ProductListTrend />
            <Categories />
            <ProductListShowCase />
            <HomeBannerCollection />
            <ProductTabs />
            <div className='mt-12'>
                <ProductListSlider title='Sản phẩm đã xem' products={products} />
            </div>
            <BottomBanner />
        </div>
    )
}

export default Home;
