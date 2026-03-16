const selectVariantElement = $("#ProductSelect-product-template");

const updateVariantPrice = (colorFramed, mount) => {
  const foundVariants = [];

  selectVariantElement.find("option").each(function () {
    const currentOption = this.innerHTML.trim();

    if (currentOption.includes(colorFramed) && currentOption.includes(mount)) {
      foundVariants.push(this);
    }
  });

  foundVariants.map((variant) => {
    const variantTitle = variant.innerHTML.split("/")[0].trim();
    const variantPrice = $(variant).data("price");
    const variantDescription = $(variant).data("description");

    $(
      `.selector-wrapper-1 .swatch-element label[title="${variantTitle}"] p.price`
    ).html(theme.Currency.formatMoney(variantPrice));
    $(
      `.selector-wrapper-1 .swatch-element label[title="${variantTitle}"] p.description`
    ).html(variantDescription);
  });
};

$(document).ready(function () {
  const colorFramed = $(
    '.selector-wrapper-2 .swatch-element:has(input[checked="checked"]) label'
  ).attr("title");
  const mount = $(
    '.selector-wrapper-3 .swatch-element:has(input[checked="checked"]) label'
  ).attr("title");
  
  updateVariantPrice(colorFramed, mount);

  $(".selector-wrapper-2 .swatch-element label").on("click", function () {
    let colorFramed = $(this).attr("title");
    let mount = $(
      '.selector-wrapper-3 .form-label .label-value-3'
    ).html().trim();

    if(colorFramed === "Unframed") mount = "Border"
    
    updateVariantPrice(colorFramed, mount);
  });
  
  $(".selector-wrapper-3 .swatch-element label").on("click", function () {

    const colorFramed = $(
      '.selector-wrapper-2 .form-label .label-value-2'
    ).html().trim();
    
    const mount = $(this).attr("title");
    
    updateVariantPrice(colorFramed, mount);
  });
});
