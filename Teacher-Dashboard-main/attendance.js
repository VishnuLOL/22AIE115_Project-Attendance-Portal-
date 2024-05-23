
        function showAddStudentForm() {
            document.getElementById('addStudentPopup').style.display = 'block';
        }

        function showAddClassForm() {
            document.getElementById('addClassPopup').style.display = 'block';
        }

        function closePopup(popupId) {
            document.getElementById(popupId).style.display = 'none';
        }

        function addStudent() {
            const studentName = document.getElementById('newStudentName').value;
            const studentRoll = document.getElementById('newStudentRoll').value;

            if (studentName && studentRoll) {
                const classSelector = document.getElementById('classSelector');
                const selectedClass = classSelector.options[classSelector.selectedIndex].value;

                if (!selectedClass) {
                    alert('Please select a class first.');
                    return;
                }

                const studentsList = document.getElementById('studentsList');
                const studentItem = document.createElement('li');
                studentItem.innerHTML = `<p>${studentName} (Roll No: ${studentRoll})</p></br> <select>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                </select>`;
                studentsList.appendChild(studentItem);

                document.getElementById('newStudentName').value = '';
                document.getElementById('newStudentRoll').value = '';
                closePopup('addStudentPopup');
            } else {
                alert('Please enter all required fields.');
            }
        }

        function addClass() {
            const className = document.getElementById('newClassName').value;

            if (className) {
                const classSelector = document.getElementById('classSelector');
                const newClassOption = document.createElement('option');
                newClassOption.value = className;
                newClassOption.text = className;
                classSelector.add(newClassOption);

                document.getElementById('newClassName').value = '';
                closePopup('addClassPopup');
            } else {
                alert('Please enter a class name.');
            }
        }

        function showStudentsList() {
            const studentsList = document.getElementById('studentsList');
            studentsList.innerHTML = ''; // Clear the list first
            const selectedClass = document.getElementById('classSelector').value;

            // Retrieve students from localStorage
            const studentsData = JSON.parse(localStorage.getItem('studentsData')) || {};
            const classStudents = studentsData[selectedClass] || [];

            classStudents.forEach(student => {
                const studentItem = document.createElement('li');
                studentItem.innerHTML = `${student.name} (Roll No: ${student.roll}) <select style="font-size: 20px;"> 
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                </select>`;
                studentsList.appendChild(studentItem);
            });

            document.getElementById('summarySection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'none';
        }

        function submitAttendance() {
            const classSelector = document.getElementById('classSelector');
            const dateSelector = document.getElementById('dateSelector');
            const periodSelector = document.getElementById('periodSelector');
            const semesterSelector = document.getElementById('semesterSelector');

            const selectedClass = classSelector.value;
            const selectedDate = dateSelector.value;
            const selectedPeriod = periodSelector.value;
            const selectedSemester = semesterSelector.value;

            if (!selectedClass || !selectedDate || !selectedPeriod || !selectedSemester) {
                alert('All fields must be selected.');
                return;
            }

            const studentsList = document.getElementById('studentsList');
            const studentItems = studentsList.getElementsByTagName('li');

            if (studentItems.length === 0) {
                alert('No students found for the selected class.');
                return;
            }

            const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
            const newAttendanceRecords = [];

            for (let i = 0; i < studentItems.length; i++) {
                const studentItem = studentItems[i];
                const studentName = studentItem.innerText.split(' (Roll No: ')[0];
                const studentRoll = studentItem.innerText.split(' (Roll No: ')[1].split(')')[0];
                const status = studentItem.querySelector('select').value;

                const attendanceRecord = {
                    name: studentName,
                    roll: studentRoll,
                    class: selectedClass,
                    date: selectedDate,
                    period: selectedPeriod,
                    semester: selectedSemester,
                    status: status
                };

                newAttendanceRecords.push(attendanceRecord);
            }

            attendanceData.push(...newAttendanceRecords);
            localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

            document.getElementById('summarySection').style.display = 'block';
            document.getElementById('resultSection').style.display = 'none';
            updateSummary();
        }

        function updateSummary() {
            const classSelector = document.getElementById('classSelector').value;
            const dateSelector = document.getElementById('dateSelector').value;
            const periodSelector = document.getElementById('periodSelector').value;
            const semesterSelector = document.getElementById('semesterSelector').value;

            const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
            const filteredAttendanceData = attendanceData.filter(record =>
                record.class === classSelector &&
                record.date === dateSelector &&
                record.period === periodSelector &&
                record.semester === semesterSelector
            );

            const totalStudents = filteredAttendanceData.length;
            const totalPresent = filteredAttendanceData.filter(record => record.status === 'present').length;
            const totalAbsent = filteredAttendanceData.filter(record => record.status === 'absent').length;
            const totalLeave = filteredAttendanceData.filter(record => record.status === 'leave').length;

            document.getElementById('totalStudents').innerText = totalStudents;
            document.getElementById('totalPresent').innerText = totalPresent;
            document.getElementById('totalAbsent').innerText = totalAbsent;
            document.getElementById('totalLeave').innerText = totalLeave;
        }

        function showAttendanceResult(selectedClass, selectedDate, selectedPeriod, selectedSemester) {
            const resultSection = document.getElementById('resultSection');

            const now = new Date();
const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            const savedAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
            const filteredAttendanceData = savedAttendanceData.filter(record =>
                record.class === selectedClass &&
                record.date === selectedDate &&
                record.period === selectedPeriod &&
                record.semester === selectedSemester
            );

            const totalStudents = filteredAttendanceData.length;
            const totalPresent = filteredAttendanceData.filter(record => record.status === 'present').length;
            const totalAbsent = filteredAttendanceData.filter(record => record.status === 'absent').length;
            const totalLeave = filteredAttendanceData.filter(record => record.status === 'leave').length;

            document.getElementById('attendanceDate').innerText = selectedDate;
            document.getElementById('attendanceTime').innerText = time;
            document.getElementById('attendanceClass').innerText = selectedClass;
            document.getElementById('attendanceTotalStudents').innerText = totalStudents;
            document.getElementById('attendancePresent').innerText = totalPresent;
            document.getElementById('attendanceAbsent').innerText = totalAbsent;
            document.getElementById('attendanceLeave').innerText = totalLeave;

            resultSection.style.display = 'block';
        }