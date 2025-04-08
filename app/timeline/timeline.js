import styles from "./timeline.scss";


class TimelineComponent extends HTMLElement {
  static get observedAttributes() {
    return ["disabled", "steps"]; // Observe 'disabled' and 'steps'
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // Create a wrapper for the timeline
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("timeline");
    shadow.appendChild(this.wrapper);

    // Inject styles into shadow DOM
    const style = document.createElement("style");
    style.textContent = styles;  // Ensure this is the final CSS string
    shadow.appendChild(style);
  }

  // Render the timeline steps
  renderSteps() {
    const steps = this.getAttribute("steps");
    if (!steps) return;
  
    console.log("Steps JSON:", steps);  // Log the steps to check its structure
  
    let stepsArray = [];
    try {
      stepsArray = JSON.parse(steps); // Try parsing the 'steps' attribute
    } catch (error) {
      console.error("Error parsing steps JSON:", error);
      return; // Exit if parsing fails
    }
  
    this.wrapper.innerHTML = ""; // Clear existing content
  
    stepsArray.forEach((step, index) => {
      const timelineItem = document.createElement("div");
      timelineItem.classList.add("timeline-item");
  
      // Create left and right text elements
      const leftText = document.createElement("div");
      leftText.classList.add("left-text");
      leftText.innerHTML = `${step.date || ""}<br>${step.time || ""}`;
  
      const rightText = document.createElement("div");
      rightText.classList.add("right-text");
  
      // Insert HTML content safely (e.g., <br>, <span>), ensuring it renders as expected
      rightText.innerHTML = step.text ? step.text.replace(/\n/g, "<br>") : ""; // Convert newline to <br>
  
      // Create the circle
      const circle = document.createElement("div");
      circle.classList.add("circle");
  
      // Create the line connecting circles (except for the last item)
      if (index < stepsArray.length - 1) {
        const line = document.createElement("div");
        line.classList.add("line");
        timelineItem.appendChild(line);
      }
  
      timelineItem.appendChild(leftText);
      timelineItem.appendChild(circle);
      timelineItem.appendChild(rightText);
      this.wrapper.appendChild(timelineItem);
  
      // Apply styles based on selected attribute
      if (step.selected) {
        circle.style.backgroundColor = "#009688";
        leftText.classList.add("bold");
        rightText.classList.add("rightbold");
      }
    });
  }
  
  

  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      const isDisabled = newValue === "true";
      this.wrapper.classList.toggle("disabled", isDisabled);
    }

    if (name === "steps") {
      this.renderSteps();
    }
  }
}

export default TimelineComponent;



// import styles from "./timeline.scss";

// class TimelineComponent extends HTMLElement {
//   constructor() {
//     super();
//     const shadow = this.attachShadow({ mode: "open" });

//     // Create a wrapper for the timeline
//     const wrapper = document.createElement("div");
//     wrapper.classList.add("timeline");

//     // Get all timeline-step children
//     const steps = this.querySelectorAll("timeline-step");

//     // Check for the 'disabled' attribute
//     const disabledAttribute = this.getAttribute("disabled"); // Get the attribute value
//     const isDisabled = disabledAttribute === "true"; // Determine if the component is disabled
//     console.log(`Timeline is disabled: ${isDisabled}`); // Debugging log

//     // Set opacity if disabled
//     if (isDisabled) {
//       wrapper.classList.add("disabled");
//     }

//     steps.forEach((step, index) => {
//       const timelineItem = document.createElement("div");
//       timelineItem.classList.add("timeline-item");

//       // Create the circle
//       const circle = document.createElement("div");
//       circle.classList.add("circle");

//       const selectedAttribute = step.getAttribute("selected"); // Get the attribute value
//       console.log(`Step ${index + 1} selected: ${selectedAttribute}`); // Debugging log

//       // Only set color if selectedAttribute is "true"
//       const color = selectedAttribute === "true" ? "#009688" : "#FFFFFF"; // Change color to the circle
//       circle.style.backgroundColor = color; // Apply the color to the circle

//       // Create left and right text elements
//       const leftText = document.createElement("div");
//       leftText.classList.add("left-text");

//       // Get date and time attributes
//       const date = step.getAttribute("date") || ""; // Get the 'date' attribute or default to an empty string
//       const time = step.getAttribute("time") || ""; // Get the 'time' attribute or default to an empty string

//       // Format left text with date and time
//       leftText.innerHTML = `${date}<br><span style="padding-right:6px;">${time}</span>`; // Add formatted date and time with padding for time

     

//       const rightText = document.createElement("div");
//       rightText.classList.add("right-text");

//        // Check if the step is selected and add 'bold' class accordingly
//        if (selectedAttribute === "true") {
//         leftText.classList.add("bold"); // Add the bold class if the step is selected
//         rightText.classList.add("rightbold"); // Add the bold class if the step is selected

//       }

//       // Get right-text attribute, default to an empty string if it doesn't exist
//       const rightTextValue = step.getAttribute("right-text") || ""; 
//       rightText.innerHTML = rightTextValue.replace(/\n/g, '<br>'); // Convert newline to <br>

//       // Create the line connecting circles (except for the last item)
//       if (index < steps.length - 1) {
//         const line = document.createElement("div");
//         line.classList.add("line");
//         line.style.backgroundColor = color; // Apply the color to the line
//         timelineItem.appendChild(line);
//       }

//       timelineItem.appendChild(leftText);
//       timelineItem.appendChild(circle);
//       timelineItem.appendChild(rightText);
//       wrapper.appendChild(timelineItem);
//     });

//     // Inject styles into shadow DOM
//     const style = document.createElement("style");
//     style.textContent = styles.toString(); 

//     shadow.appendChild(style);
//     shadow.appendChild(wrapper);
//   }
// }

// export default TimelineComponent;
