pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.50.1-noble'
            args '--network paybank-playwright_skynet'
        }
    }

    stages {
        stage('Node.js Deps') {
            steps {
                sh 'npm install'
            }
        }
        stage('E2E Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
