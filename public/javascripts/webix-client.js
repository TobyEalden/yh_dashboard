/**
 * Created by toby on 13/05/15.
 */
if (typeof window.centrePoint === "undefined") {
  centrePoint = {};
}

(function() {
  var activeMap = "";
  var activeFeatureId = "";
  var activeFeatureName = "";
  centrePoint.mapInitialised = false;
  centrePoint.useTouch = true; //webix.env.touch;

  // Renders the information for the currently active feature.
  centrePoint.renderFeatureInfo = function() {
    var template;

    if (activeFeatureId.length === 0) {
      // There is no active feature.
      template = document.getElementById("noFeatureData").innerHTML;
    } else if (activeFeatureId === "sources") {
      template  = webix.ajax().sync().get("/related_factors").responseText;
    } else {
      template = webix.ajax().sync().get("/ajaxFeature/" + activeFeatureId).responseText;
    }
    return template;
  };

  // Dynamically creates the label text for the date slider
  centrePoint.getDataDateTitle = function(slider) {
    var lookup = aDates[slider.value];
    return lookup[0] + " " + lookup[1];
  };

  // Re-loads the data based on the date slider value.
  centrePoint.onDataDateChange = function(index) {
    showView("map");
    setHeaderTitle();

    if (false === $$("homelessnessView").config.collapsed) {
      getHomelessnessData("P1E",index);
    }

    if (false === $$("missingView").config.collapsed) {
      $$("homelessnessFeatures").refresh();
    }
  };

  // Toggle the risk factor checkboxes and re-load data.
  centrePoint.riskFactorSelectAll = function() {
    var formData = $$("riskFactorsForm").getValues();
    for (var name in formData) {
      if (formData.hasOwnProperty(name)) {
        $$("rf_" + name).setValue(this.getValue());
      }
    }
    centrePoint.riskFactorSelection();
  };

  // Re-loads the risk factor data based on the checkbox values.
  centrePoint.riskFactorSelection = function() {
    console.log($$("riskFactorsForm"))
    var formData = $$("riskFactorsForm").getValues();
    var selected = [];
    for (var name in formData) {

      if (formData.hasOwnProperty(name) && formData[name] !== 0) {
        selected.push(name);
      }
    }

    showView("map");
    setMapBusy();
    getRiskFactorData(selected);
  };

  centrePoint.accordionViewChanged = function() {
    var newMapView;
    if (false === $$("homelessnessView").config.collapsed) {
      newMapView = "homelessness";
    } else if (false === $$("missingView").config.collapsed) {
      newMapView = "missing";
    } else {
      newMapView = "riskFactors";
    }

    activeMap = newMapView;
    activeFeatureId = activeFeatureName = "";

    showView("map");

    if (centrePoint.mapInitialised) {
      if ($$("homelessnessMap").map) {
        switch (activeMap) {
          case "homelessness":
            centrePoint.onDataDateChange($$("homelessnessDateSlider").getValue());
            break;
          case "missing":
            getHomelessnessData("P1E_Missing", 0);
            break;
          case "riskFactors":
            centrePoint.riskFactorSelection();
            break;
          default:
            break;
        }
      }

      setHeaderTitle();
    }
  };

  centrePoint.onSourceClick = function() {
    showView("source");
  };

  centrePoint.onLegendClick = function() {
    showView("legend");
  };

  // Enable webix debugging.
  webix.debug = true;

  // Include ui elements.
//  webix.require("../javascripts/webix-ui.js");

  webix.ready(function() {
    if (centrePoint.useTouch) {
      // On a touch-screen device.
      webix.ui.fullScreen();

      // Create the webix ui.
      webix.ui(centrePoint.uiMainLayout);
    } else {
      // On an non-touch screen device.
      webix.ui(centrePoint.uiPageLayout);
    }

    // Add an overlay for the 'loading' icon.
    webix.extend($$("homelessnessMap"), webix.ProgressBar);

    $$("viewAccordion").attachEvent("onAfterExpand",  centrePoint.accordionViewChanged);

    activeFeatureId = preLoadFeature;
    showView(preLoadView);
  });

  function getHomelessnessData(type, index) {
    setMapBusy();
    getData(type, index);
  }

  function setMapBusy() {
    $$("homelessnessMap").showProgress({ type: "icon"});

    // Make an imperceptible change to the map position. Since this is queued after the data load
    // we can use it to determine when the data has finished loading via the idle event.
    // (see http://stackoverflow.com/a/9874889)
    var m = $$("homelessnessMap").map;
    m.setCenter(new google.maps.LatLng(m.getCenter().lat(), m.getCenter().lng() + .000000001));
  }

  function clearMapBusy() {
    $$("homelessnessMap").hideProgress();
  }

  function setHeaderTitle() {
    var title = "";
    switch (activeMap) {
      case "homelessness":
        var index = $$("homelessnessDateSlider").getValue();
        title = "Official youth homelessness"; // + aDates[index][0] + "/" + aDates[index][1];
        break;
      case "missing":
        title = "Missing data";
        break;
      case "riskFactors":
        title = "Index of related factors"
        break;
    }
    title = "<span style='float:right;font-size: 1em;margin-right:20px'>" + title + "</span>";
    if (activeFeatureName.length > 0) {
      title = title + "<span style='font-size:1em;'>" + activeFeatureName + "</span>";
    }
    $$("featureLabel").define("label", title);
    $$("featureLabel").refresh();
  }

  function loadMap() {
    if (!centrePoint.mapInitialised) {
      // In touch mode, add the logo and search box as overlays on the map view
      // to optimise space.
      var ele = document.createElement("div");
      ele.innerHTML = "<div class='cp_floating_logo'><img src='/images/logo.png' /></div>";
      $$("homelessnessMap")._contentobj.appendChild(ele.firstChild);

      // Create a container for the search ui.
      ele = document.createElement("div");
      ele.innerHTML = "<div class='cp_floating_search' id='searchBox' />";
      $$("homelessnessMap")._contentobj.appendChild(ele.firstChild);

      ele = document.createElement("div");
      ele.innerHTML = "<div class='cp_floating_key' id='keyBox' />";
      $$("homelessnessMap")._contentobj.appendChild(ele.firstChild);

      // Create the search ui.
      webix.ui(centrePoint.uiFloatingSearch);

      // Create the legend ui
      webix.ui(centrePoint.uiLegendButton);

      // Add listeners for click, hover and idle events.
      var gmap = $$("homelessnessMap").map;
      gmap.data.addListener('mouseover', onMouseOverMap);
      gmap.data.addListener('mouseout', onMouseOffMap);
      gmap.data.addListener('click', onFeatureClick);
      gmap.addListener('idle', clearMapBusy);

      // Initialise the map data.
      initialiseMap(gmap);

      centrePoint.mapInitialised = true;

      centrePoint.accordionViewChanged();
    }
  }

  function onMouseOverMap(event) {
    if (!webix.env.touch) {
      activeFeatureId = event.feature.getProperty('geo_code');
      activeFeatureName = event.feature.getProperty('geo_label');
      setHeaderTitle();
    }
  }

  function onMouseOffMap(event) {
    if (!webix.env.touch) {
        activeFeatureId = "";
        activeFeatureName = "";
        setHeaderTitle();
    }
  }

  function onFeatureClick(event){
    // Get feature details.
    activeFeatureId = event.feature.getProperty('geo_code');
    activeFeatureName = event.feature.getProperty('geo_label');

    window.history.pushState(null,null,"/feature/" + activeFeatureId);

    showView("feature");
  }

  function showView(view) {
    $$("mapButton").show();
    $$("resetButton").hide();

    switch(view) {
      case "map":
        $$("mapButton").hide();
        $$("resetButton").show();
        $$("mainPanelView").setValue("homelessnessMap");
        loadMap();
        window.history.pushState(null, null, "/");
        break;
      case "feature":
        $$("mainPanelView").setValue("homelessnessFeatureView");
        break;
      case "source":
        $$("mainPanelView").setValue("sourceView");
        break;
      case "welcome":
        $$("mainPanelView").setValue("welcomeView");
        window.history.pushState(null,null,"/welcome");
        break;
      case "legend":
        $$("mainPanelView").setValue("legendView");
        break;
    }
  }
}());

