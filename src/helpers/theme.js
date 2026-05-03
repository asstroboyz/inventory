
const themeOption = (theme) => { return { ...theme, borderRadius: 10, } };
export default themeOption;

export const stylesFlexSelect = {
    menu: (base) => ({
        ...base,
        width: "max-content",
        minWidth: "100%"
    }),
};


export const getOptionProductLabel = (option) => {
    console.log(option)
    return (
        <span className={option.product_last_stock == 0 ? 'bg-red-300' : 'bg-green-300'}>
            {option.label}
        </span>
    );
};

export const getStylesProduct = (x) => {
    console.log(x)
}

export const customStylesLabelProduct = {


    menuPortal: provided => ({ ...provided, zIndex: 9999 }),                                     
    menu: (base) => ({
        ...base,
        zIndex: 9999 ,
        width: "max-content",
        minWidth: "100%"
    }),

    option: (provided, state) => {
        // console.log(state)
        return {
            ...provided,
            zIndex: "9999  !important", // set the zIndex value as per your requirement
            backgroundColor: state.isSelected || state.isFocused
                ? provided.backgroundColor
                : state.data.product_last_stock === 0 ? "red" : 'white',
            // "#FECACA"
            color: state.isSelected || state.isFocused
                ? provided.color
                : state.data.product_last_stock === 0 ? 'white' : 'black',
        }
    },
};
