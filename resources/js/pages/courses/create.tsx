import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import EmojiPicker from 'emoji-picker-react';
import Select, { components } from 'react-select'
import { SquarePen, X } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import {type Course } from '@/types'
import { InputProps } from 'react-select';






type Student = {
  id: number;
  name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Créer un cours',
    href: '/courses/create',
  },
];

export default function CourseCreate() {
  const [courseName, setCourseName] = useState('');
  const [createdCourse, setCreatedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [emoji, setEmoji] = useState<string>('📚');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/students')
      .then(res => setStudents(res.data))
      .catch(() => alert('Erreur lors du chargement des élèves.'));
  }, []);

  const createCourse = () => {
    setError(null);
    setCreatedCourse(null);
    if (!courseName.trim()) {
      setError('Le nom du cours ne peut pas être vide.');
      return;
    }
    axios.post('/courses/create', {
      name: courseName,
      student_ids: selectedStudents.map(student => student.id),
      icon: emoji,
    }).then(res => {
      setCreatedCourse(res.data.course);
      setCourseName('');
      setSelectedStudents([]);
      setEmoji('📚');
    })
      .catch((error) => setError(error.response?.data?.message || 'Erreur lors de la création du cours.'));
  };

  const mirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      inputRef.current.style.width = `${mirrorRef.current.offsetWidth}px`;
    }
  }, [courseName]);


  const CustomInput: React.FC<InputProps<{ value: number; label: string }, true>> = (props) => (
    <>
      <components.Input {...props} />
      <span
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#aaa',
          pointerEvents: 'none',
          fontSize: 14,
          display: props.value ? 'none' : 'block',
        }}
      >
        Sélectionnez des élèves
      </span>
    </>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div id='course-create-form'>


        <section id='course-creation'>
          <div>
            <button onClick={() => setOpenEmojiPicker(!openEmojiPicker)} id='emoji-button'>
              {emoji}
              {
                openEmojiPicker ?
                  <X id='close-emoji' /> :
                  <SquarePen id='add-emoji' />
              }
            </button>
            <EmojiPicker open={openEmojiPicker} onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)} style={{ position: "absolute", zIndex: 999, }} />
          </div>

          <div style={{ width: '100%', display: "flex", justifyContent: "center", position: 'relative' }}>
            <span
              style={{
                visibility: 'hidden',
                position: 'absolute',
                font: 'inherit',
                padding: '0 10px',
                fontSize: 24,
                fontWeight: 'bold',
                maxWidth: '100%',
                textAlign: 'center',
              }}
              id="input-width-mirror"
              ref={mirrorRef}
            >
              {courseName || 'Écrivez le nom du cours'}
            </span>
            <TextareaAutosize
              id="course-name"
              // type="text"

              value={courseName}
              onChange={e => {
                setCourseName(e.target.value);
              }}
              placeholder="Écrivez le nom du cours"
              ref={inputRef}
              maxRows={3}
              rows={1}
              maxLength={50}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <button onClick={createCourse} className='btn'>Créer le cours</button>

          {createdCourse && (
            <>
              <h3>Cours créé : {createdCourse.name}</h3>
            </>
          )}

          {error && <p className='error'>{error}</p>}

        </section>

        <section id='students-selection'>

          <Select options={students.map(student => {
            return { value: student.id, label: student.name };
          })}
            isMulti
            className='w-full'
            closeMenuOnSelect={false}
            hideSelectedOptions
            backspaceRemovesValue={false}
            styles={
              {
                multiValue: (base) => ({
                  ...base,
                  display: 'none',
                }),
                placeholder: (base) => ({
                  ...base,
                  display: 'none',
                }),
              }
            }
            onChange={(selectedOptions) => {
              setSelectedStudents(selectedOptions.map(option => ({ id: option.value, name: option.label })));
            }}
            value={selectedStudents.map(student => ({
              value: student.id,
              label: student.name
            }))}
            noOptionsMessage={() => 'Aucun élève trouvé'}
            placeholder='Sélectionnez des élèves'
            components={{ Input: CustomInput }}
            isClearable={false}
          />




          <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
            <p>{selectedStudents.length > 0 ? "Élèves " : "Pas d'élèves "} sélectionnés pour ce cours</p>
            <ul id='students-list'>
              {
                selectedStudents.length > 0 && (
                  selectedStudents.map(student => {
                    return (
                      <li key={student.id} className='student-item'>
                        <span>{student?.name}</span>
                        <button onClick={() => {
                          setSelectedStudents(selectedStudents.filter(selectedStudent => selectedStudent.id !== student.id));
                        }}>
                          <X />
                        </button>
                      </li>
                    );
                  }
                  )
                )
              }
            </ul>
          </div>
        </section>
      </div>
    </AppLayout>

  );
}