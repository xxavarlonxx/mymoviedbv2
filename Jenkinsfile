pipeline{
    environment {
        registry = "hub.ahochschulte.de/mymoviedbV2"
        registryCredential = "privatehub"
        dockerImage = ''
        dockerFile = 'server/prod.dockerfile'
    }

    agent any
    tools {nodejs "node"}
    stages{
        stage("Build Frontend"){
            steps{
                script{
                    sh 'node --version'
                    sh 'cd client && npm install'
                    sh 'cd client && npm run build'
                }
            }
        }
        stage('Build image'){
            steps{
                script {
                    dockerImage = docker.build(registry + ":$BUILD_NUMBER", "-f "+ dockerFile+" .")
                }
            }
        }

        stage('Push Image to Registry'){
            steps{
                script{
                    docker.withRegistry('https://hub.ahochschulte.de/v2', registryCredential){
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Publish on remote server'){
            steps{
                script{
                    sh 'ssh dev@81.169.193.248 "cd ~/node/mymoviedb && docker-compose pull dev && docker-compose up -d"'
                }
            }
            
        }
    }
}