import ClassroomInfo from '../bricks/ClassroomInfo'
import { render, screen } from '@testing-library/react'

// Testovací objekt třídy pro komponentu ClassroomInfo
const testClassroom = {
    name: 'Test Classroom'
}

test('should render ClassroomInfo', () => {
    // Vyrenderování komponenty, kterou budeme testovat
    render(<ClassroomInfo classroom={testClassroom} />)

    // Získání elementu dle testovacího ID, které jsme přidali v minulém kroku
    const element = screen.getByTestId('classroom-title')

    // Metoda, která očekává že element se bude nacházet na stránce, pokud ne, tak test selže
    expect(element).toBeInTheDocument()
})

test('should render classroom name correctly', () => {
    render(<ClassroomInfo classroom={testClassroom} />)

    // Získání elementu z komponenty, který budeme testovat
    const nameElement = screen.getByTestId('classroom-name')
    
    // Testování, zdali se element nachází na stránce
    expect(nameElement).toBeInTheDocument()

    // Testování, zdali se v elementu nachází správný text
    expect(nameElement.textContent).toBe(testClassroom.name)
})