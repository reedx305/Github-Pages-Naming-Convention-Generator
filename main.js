// Configurable file name for templates. Needs to match your JSON file.
const TEMPLATES_FILE = 'templates.json';
// Global variable to store naming data
let namingData = [];

// DOM elements
const selector = document.getElementById('naming-selector');
const formContainer = document.getElementById('form-container');
const formTitle = document.getElementById('form-title');
const formDescription = document.getElementById('form-description');
const fieldsContainer = document.getElementById('fields-container');
const templateDisplay = document.getElementById('template-display');
const resultDisplay = document.getElementById('result-display');
const examplesList = document.getElementById('examples-list');

// Load JSON data
async function loadNamingData() {
    try {
        const response = await fetch(TEMPLATES_FILE);
        namingData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Failed to load JSON, using fallback data:', error);
        // Notify user in UI
        const warningDiv = document.getElementById('data-warning');
        if (warningDiv) {
            warningDiv.textContent = 'Warning: Default fallback data loaded. Example data is being used in main.js. Behavior is expected when running locally, if not local check TEMPLATES_FILE & Contents.';
            warningDiv.style.display = 'block';
        }
        // Fallback to hardcoded data
        namingData = [
            {
                "id": "fallback-example",
                "name": "Fallback Example",
                "description": "This loads if JSON fails to load or is ran locally.",
                "template": "{{PUBLIC}}-{{Department}}-{{DeviceType}}-{{SerialNumber}}",
                "fields": [
                    {
                        "key": "PUBLIC", 
                        "type": "checkbox", 
                        "label": "Public Server"
                    },
                    {
                        "key": "Department",
                        "type": "dropdown",
                        "label": "Department",
                        "required": true,
                        "options": [
                            {"value": "IT", "label": "IT"},
                            {"value": "MARK", "label": "Marketing"}
                        ]
                    },
                    {
                        "key": "DeviceType",
                        "type": "dropdown",
                        "label": "Device Type",
                        "required": true,
                        "options": [
                            {"value": "LAP", "label": "Laptop"},
                            {"value": "DESK", "label": "Desktop"},
                            {"value": "TAB", "label": "Tablet"},
                        ]
                    },
                    {
                        "key": "SerialNumber",
                        "type": "text",
                        "label": "Serial Number",
                        "required": true
                    }
                ]
            },
            {
                "id": "different-example-2",
                "name": "Different Example 2",
                "description": "Example option. Shows some additional formatting options.",
                "template": "[{{Environment}}] {{Project}}-{{ResourceType}} [{{TEST}}]",
                "fields": [
                    {
                        "key": "Environment",
                        "type": "dropdown",
                        "label": "Environment",
                        "options": [
                            {"value": "DEV", "label": "Development"},
                            {"value": "TEST", "label": "Testing"},
                            {"value": "PROD", "label": "Production"}
                        ]
                    },
                    {
                        "key": "Project",
                        "type": "text",
                        "label": "Project Name",
                        "required": true
                    },
                    {
                        "key": "ResourceType",
                        "type": "dropdown",
                        "label": "Resource Type",
                        "options": [
                            {"value": "VM", "label": "Virtual Machine"},
                            {"value": "STG", "label": "Storage"},
                            {"value": "NET", "label": "Network"},
                        ]
                    },
                    {
                        "key": "TEST", 
                        "type": "checkbox", 
                        "label": "For Testing Only?",
                        "required": true
                    }
                ]
            }
        ];
        initializeApp();
    }
}

// Initialize the application
function initializeApp() {
    // Populate the selector with naming convention options
    namingData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selector.appendChild(option);
    });

    // Handle selection change
    selector.addEventListener('change', function() {
        const selectedId = this.value;
        if (selectedId) {
            const selectedData = namingData.find(item => item.id === selectedId);
            if (selectedData) {
                displayForm(selectedData);
            }
        } else {
            formContainer.style.display = 'none';
        }
    });

}

// Generate and display the output based on current field values
function updateLiveOutput(data) {
    let result = data.template;
    data.fields.forEach(field => {
        const element = document.getElementById(field.key);
        let value = '';
        if (field.type === 'dropdown') {
            value = element.value;
        } else if (field.type === 'text') {
            value = element.value || '';
        } else if (field.type === 'checkbox') {
            value = element.checked ? field.key : '';
        }
        result = result.replace(new RegExp(`{{${field.key}}}`, 'g'), value);
    });
    // Clean up output: collapse multiple hyphens, remove leading/trailing hyphens, remove empty bracketed groups, collapse spaces
    result = result
        .replace(/-{2,}/g, '-')      // collapse multiple hyphens
        .replace(/^-+/, '')          // remove leading hyphens
        .replace(/-+$/, '')          // remove trailing hyphens
        .replace(/\[\s*([-\s]*)\s*\]/g, '') // remove any [   ], [---], or [   -  ] left empty
        .replace(/\s{2,}/g, ' ')     // collapse extra spaces
        .trim();
    resultDisplay.innerHTML = '<strong>Output:</strong> ' + result;
}

// Display form based on selected naming convention
function displayForm(data) {
    formTitle.textContent = data.name;
    formDescription.textContent = data.description;
    templateDisplay.textContent = data.template;
    // Clear previous fields
    fieldsContainer.innerHTML = '';
    // Add fields
    data.fields.forEach(field => {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-group';
        const label = document.createElement('label');
        label.className = 'form-label';
        label.setAttribute('for', field.key);
        // Add asterisk if required, and make it red
        if (field.required) {
            label.innerHTML = field.label + ' <span style="color: red;">*</span>';
        } else {
            label.textContent = field.label;
        }
        if (field.type === 'dropdown') {
            const dropdown = document.createElement('select');
            dropdown.className = 'dropdown';
            dropdown.id = field.key;
            dropdown.name = field.key;
            if (field.required) dropdown.required = true;
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select ' + field.label + ' --';
            dropdown.appendChild(defaultOption);
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                dropdown.appendChild(opt);
            });
            fieldGroup.appendChild(label);
            fieldGroup.appendChild(dropdown);
        } else if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-input';
            input.id = field.key;
            input.name = field.key;
            input.placeholder = 'Enter ' + field.label;
            if (field.required) input.required = true;
            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
        } else if (field.type === 'checkbox') {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkbox-container';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox-input';
            checkbox.id = field.key;
            checkbox.name = field.key;
            // Create label for required
            const checkboxLabel = document.createElement('label');
            checkboxLabel.setAttribute('for', field.key);
            if (field.required) {
                checkboxLabel.innerHTML = field.label + ' <span style="color: red;">*</span>';
            } else {
                checkboxLabel.textContent = field.label;
            }
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkboxLabel);
            fieldGroup.appendChild(checkboxContainer);
        }
        fieldsContainer.appendChild(fieldGroup);
    });
    // Attach live update listeners
    data.fields.forEach(field => {
        const element = document.getElementById(field.key);
        if (element) {
            if (field.type === 'text' || field.type === 'dropdown') {
                element.addEventListener('input', () => updateLiveOutput(data));
                element.addEventListener('change', () => updateLiveOutput(data));
            } else if (field.type === 'checkbox') {
                element.addEventListener('change', () => updateLiveOutput(data));
            }
        }
    });
    // Reset output/copy button to avoid DOM issues
    let resultContainer = resultDisplay.parentElement;
    // Remove any previous copy button
    const prevCopyBtn = document.getElementById('copy-output-btn');
    if (prevCopyBtn) prevCopyBtn.remove();
    // Remove any previous wrapper
    const prevWrapper = resultContainer.querySelector('.output-copy-wrapper');
    if (prevWrapper) prevWrapper.remove();
    // Create a new wrapper for output and button
    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'output-copy-wrapper';
    // Move resultDisplay into wrapper
    outputWrapper.appendChild(resultDisplay);
    // Create and append copy button below output
    const copyBtn = document.createElement('button');
    copyBtn.id = 'copy-output-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.className = 'copy-output-btn';
    copyBtn.style.display = 'block';
    copyBtn.style.margin = '8px 0 0 0';
    copyBtn.addEventListener('click', function() {
        // Copy only the output text, not the label
        const outputText = resultDisplay.textContent.replace(/^Output:\s*/i, '');
        navigator.clipboard.writeText(outputText).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
        });
    });
    outputWrapper.appendChild(copyBtn);
    // Insert wrapper into resultContainer
    resultContainer.appendChild(outputWrapper);
    // Initial output
    updateLiveOutput(data);
    // Generate examples
    generateExamples(data);
    // Show form
    formContainer.style.display = 'block';
    // Scroll to form
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

// Generate example values
function generateExamples(data) {
    examplesList.innerHTML = '';
    
    // Generate 3 example combinations
    for (let i = 0; i < 3; i++) {
        const example = document.createElement('li');
        let exampleText = data.template;
        
        // Replace placeholders with example values
        data.fields.forEach(field => {
            if (field.type === 'dropdown') {
                const randomOption = field.options[Math.floor(Math.random() * field.options.length)];
                exampleText = exampleText.replace(new RegExp(`{{${field.key}}}`, 'g'), randomOption.value);
            } else if (field.type === 'text') {
                exampleText = exampleText.replace(new RegExp(`{{${field.key}}}`, 'g'), `<i>${field.label}</i>`);
            } else if (field.type === 'checkbox') {
                exampleText = exampleText.replace(new RegExp(`{{${field.key}}}`, 'g'), field.key);
            }
        });
        
        example.innerHTML = exampleText;
        examplesList.appendChild(example);
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadNamingData);