/**
 * Created by toby on 13/05/15.
 *
 * UI components.
 */

if (typeof window.centrePoint === "undefined") {
  centrePoint = {};
}

// Search form used in non-touch scenarios.
centrePoint.uiSearchForm = {
  rows: [
    {},
    { view: "search", placeholder: "search", on: { onChange: findAddress } },
    {}
  ]
};

centrePoint.uiFloatingSearch = {
  view: "search",
    container: "searchBox",
  placeholder: "search",
  on: { onChange: findAddress }
};

// Header used in non-touch scenarios.
centrePoint.uiHeader = {
  height: 80,
  css: "cp_header",
  cols: [
    { view: "label", css: "cp_logo", width: 170, template: "<a href=\"/\"><img src=\"/images/logo.png\" alt=\"centre point logo\" /></a>"},
    {},
    centrePoint.uiSearchForm
  ]
};

centrePoint.uiLegendButton = {
  view: "button",
  type: "iconButton",
  icon: "key",
  label: "key",
  width: 70,
  container: "keyBox",
  on: { onItemClick: centrePoint.onLegendClick }
};

//************************************************************************
// Youth homelessness UI
//************************************************************************

// Side-bar ui for youth homelessness.
centrePoint.uiHomelessnessSideBar = {
  id: "homelessness",
  view: "scrollview",
  scroll: "y", //webix.env.touch ? "y" : false,
  body: {
    rows: [
      {
        cols: [
          {view: "label", label: "2012", width: 40, align: "right" },
          {
            view: "slider",
            id: "homelessnessDateSlider",
            step: 1,
            min: 0,
            max: aDates.length - 1,
            value: aDates.length - 1,
            title: centrePoint.getDataDateTitle,
            on: { onChange: centrePoint.onDataDateChange }
          },
          {view: "label", label: "2014", width: 40, align: "left" }
        ]
      },
      {
        borderless: true,
        autoheight: true,
        template: "html->homelessnessInfoText"
      },
      {}
    ]
  }
};

// Contains the info-graphic when a feature is clicked.
centrePoint.uiHomelessnessFeatureView = {
  id: "homelessnessFeatureView",
  view: "scrollview",
  scroll: "y",
  body: {
        id: "homelessnessFeatures",
        view: "template",
        autoheight: true,
        template: centrePoint.renderFeatureInfo
  }
};

// Main map view.
centrePoint.uiHomelessnessMap = {
  id: "homelessnessMap",
  view: "google-map"
};

centrePoint.uiSourceView = {
  id: "sourceView",
  template: "html->sourceView"
};

centrePoint.uiWelcomeView = {
  id: "welcomeView",
  template: "html->welcomeInfo"
};

centrePoint.uiLegendView = {
  id: "legendView",
  template: "html->legendView"
};

//************************************************************************
// Missing data UI
//************************************************************************

// Missing data side-bar.
centrePoint.uiMissingSideBar = {
  id: "missing",
  borderless: true,
  template: "html->missingDataInfoText"
};

//************************************************************************
// Risk factor UI
//************************************************************************

// Risk factor selection form, shown in the left-hand side-bar.
centrePoint.uiRiskFactorsSideBar = {
  view: "form",
  id: "riskFactorsForm",
  css: "cp_riskFactorForm",
  type: "clean",
  padding: 4,
  scroll: "y",
  elementsConfig: {
      gravity: 5,
      on: {onItemClick: centrePoint.riskFactorSelection},
      labelWidth: 225
  },
  elements: [
      //{view: "checkbox", label: "Select all", on: {onItemClick: centrePoint.riskFactorSelectAll}},
      {template: "html->riskFactorInfoText", height: 60, css: "cp_riskFactorIntro" },
      {view: "button", value: "more details...", on: { onItemClick: centrePoint.onSourceClick }},
      {template: "Economy", type: "section"},
      {
          view: "checkbox",
          id: "rf_unemployment_total",
          name: "unemployment_total",
          label: "Youth unemployment"
      },
      {template: "Social care", type: "section"},
      {view: "checkbox", id: "rf_care", name: "care", label: "Children in care"},
      {template: "Environment", type: "section"},
      {view: "checkbox", id: "rf_deprivation", name: "deprivation", label: "Index of deprivation"},
      {template: "Education", type: "section"},
      {
          view: "checkbox",
          id: "rf_education_level3",
          name: "education_level3",
          label: "2 or more A levels or equivalent"
      },
      {
          view: "checkbox",
          id: "rf_education_attainment_gap",
          name: "education_attainment_gap",
          label: "Achievement gap"
      },
      {view: "checkbox", id: "rf_apprenticeship", name: "apprenticeship", label: "Apprenticeship starts"},
      {view: "checkbox", id: "rf_truancy", name: "truancy", label: "Persistent truancy"},
      {template: "Health", type: "section"},
      {view: "checkbox", id: "rf_hospital", name: "hospital", label: "Hospital admissions (under 24s)"},
      {
          view: "checkbox",
          id: "rf_mentalhealth",
          name: "mentalhealth",
          label: "Mental health problems (all ages)"
      },
      {}
  ]
};

//************************************************************************
// Main UI
//************************************************************************

centrePoint.uiMainLayout = {
  id: "rootLayout",
  rows: [
    {
      responsive: "rootLayout",
      cols: [
        {
          minwidth: 350,
          rows: [
            {
              id: "mainHeader",
              view: "toolbar",
              elements: [
                { view: "button", id: "mapButton", type: "iconButton", icon: "chevron-left", label: "map", width: 80, on: { onItemClick: centrePoint.accordionViewChanged } },
                { view: "label", id: "featureLabel", label: "Official youth homelessness"},
                { view: "button", id: "resetButton", borderless: true, type: "iconButton", icon: "refresh", label: "reset map", width: 110, on: { onItemClick: resetMap } }
              ]

            },
            {
              id: "mainPanelView",
              view: "multiview",
              minWidth: 300,
              fitBiggest: true,
              cells: [
                centrePoint.uiWelcomeView,
                centrePoint.uiHomelessnessMap,
                centrePoint.uiHomelessnessFeatureView,
                centrePoint.uiSourceView,
                centrePoint.uiLegendView
              ]
            }
          ]
        },
        {
          view: "accordion",
          id: "viewAccordion",
          minWidth: 310,
          gravity: 0.01,
          type: "line",
          multi: false,
          rows: [
            {
              header: "Official youth homelessness",
              id: "homelessnessView",
              headerAltHeight: 50,
              headerHeight: 48,
              body: centrePoint.uiHomelessnessSideBar
            },
            {
              header: "How much data is missing",
              id: "missingView",
              headerAltHeight: 50,
              headerHeight: 48,
              collapsed: true,
              body: centrePoint.uiMissingSideBar
            },
            {
              header: "Related factors",
              id: "riskFactorsView",
              headerAltHeight: 50,
              headerHeight: 48,
              collapsed: true,
              body: centrePoint.uiRiskFactorsSideBar
            }
          ]
        }
      ]
    }
  ]
};

//************************************************************************
// Page layout for non-touch screen devices.
//************************************************************************
centrePoint.uiPageLayout = {
  rows: [
    {
      cols: [
        {},
        {
          gravity: 4,
          rows: [
            centrePoint.uiHeader,
            centrePoint.uiMainLayout
          ]
        },
        {}
      ]
    },
    {
      height: 20
    }
  ]
};
